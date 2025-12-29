'use client';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import {
  authApi,
  type LoginRequest,
  type RegisterRequest,
} from '../api/auth.api';

interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      // Redirect to home page after successful login
      router.push('/');
      router.refresh();
    },
    onError: (error: AxiosError<ApiError>) => {
      // Error handling is done in the component
      console.error('Login error:', error);
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onError: (error: AxiosError<ApiError>) => {
      // Error handling is done in the component
      console.error('Registration error:', error);
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Redirect to login page after logout
      router.push('/auth/login');
      router.refresh();
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      router.push('/auth/login');
    },
  });
}

/**
 * Hook for refreshing token (internal use)
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onError: (error: AxiosError<ApiError>) => {
      console.error('Token refresh error:', error);
    },
  });
}

/**
 * Helper function to extract error message from API error
 */
export function getErrorMessage(error: AxiosError<ApiError>): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
