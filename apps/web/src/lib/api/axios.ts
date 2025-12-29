import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Get CSRF token from cookie
const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_csrf') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip CSRF token for GET requests to csrf-token endpoint
    if (config.url === '/csrf-token' && config.method === 'get') {
      return config;
    }

    // Add CSRF token if available
    const csrfToken = getCsrfToken();
    if (csrfToken && config.headers) {
      // Backend expects lowercase header name
      config.headers['x-csrf-token'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _csrfRetry?: boolean;
    };

    // Handle CSRF token errors (403)
    if (error.response?.status === 403 && !originalRequest._csrfRetry) {
      const errorMessage = error.response?.data as
        | { message?: string }
        | string;
      const isCsrfError =
        typeof errorMessage === 'string'
          ? errorMessage.toLowerCase().includes('csrf')
          : errorMessage?.message?.toLowerCase().includes('csrf');

      if (isCsrfError) {
        originalRequest._csrfRetry = true;

        try {
          // Fetch new CSRF token
          await apiClient.get('/csrf-token');
          // Retry original request with new token
          return apiClient(originalRequest);
        } catch (csrfError) {
          console.error('Failed to refresh CSRF token:', csrfError);
          return Promise.reject(csrfError);
        }
      }
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await apiClient.post('/auth/refresh');

        // Process queued requests
        processQueue(null, null);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, process queue with error
        processQueue(refreshError as AxiosError, null);

        // Clear any auth-related state and redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
