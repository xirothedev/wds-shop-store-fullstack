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
  isSale?: string,
  search?:string
): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (gender) {
    params.gender = gender;
  }
  if (isSale !== undefined) {
    params.isSale = isSale;
  }
  if (search) {
    params.search = search
  }

  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/api/products',
    {
      params,
    }
  );


  return response.data.data;
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/api/products/slug/${slug}`
  );
  return response.data.data;
} 
export const getRelatedProducts = async (slug: string): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    `/api/products/related/${slug}`
  );
  return response.data.data;
}