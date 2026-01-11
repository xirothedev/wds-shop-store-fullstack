import { Product } from '@/types/product';

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

export interface OrderItemInfo extends Product {
  orderItemId: string;
  size: string;
  quantity: number;
}

export interface CreateOrderItem {
  productId: string;
  size: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItem[];
  shippingFee?: number;
  discountValue?: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
}

export interface CreateOrderResponse {
  id: string;
  code: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
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
  createOrder: async (dto: CreateOrderDto): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<ApiResponse<CreateOrderResponse>>(
      '/orders',
      dto
    );
    return unwrap(response.data);
  },
  getOrders: async (paymentStatus = 'PAID'): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', {
      params: { paymentStatus },
    });
    return unwrap(response.data);
  },
};
