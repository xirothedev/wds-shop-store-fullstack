import { apiClient } from './axios';

export interface OrderItem {
  id: string;
  productId: string | null;
  productSlug: string;
  productName: string;
  size: string;
  price: number;
  quantity: number;
}

export interface PaymentTransaction {
  id: string;
  transactionCode: string;
  amount: number;
  status: string;
  paymentUrl: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingFee: number;
  discountValue: number;
  createdAt: string;
  items: OrderItem[];
  paymentTransaction: PaymentTransaction | null;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
};

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

export const ordersApi = {
  getOrders: async (paymentStatus = 'PAID'): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', {
      params: { paymentStatus },
    });
    return unwrap(response.data);
  },
};
