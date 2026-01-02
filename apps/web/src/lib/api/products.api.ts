import type { Product } from '@/types/product';

import { apiClient } from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export const getProducts = async (
  gender?: string,
  isSale?: string
): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (gender) {
    params.gender = gender;
  }
  if (isSale !== undefined) {
    params.isSale = isSale;
  }

  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/api/products',
    {
      params,
    }
  );

  // Extract data from response wrapper
  return response.data.data;
};