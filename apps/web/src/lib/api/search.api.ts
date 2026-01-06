  import type { Product } from '@/types/product';

import { apiClient } from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Search products by name or description
 * @param query - Search term
 * @returns Array of products matching the search query
 */
export const search = async (
  query: string,
  gender?: string,
  isSale?:string,
): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (gender) {
    params.gender = gender;
  }
  if(isSale){
    params.isSale=isSale
  }
  params.q = query;

  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/api/products/search',
    {
      params,
    }
  );
  return response.data.data;
};

/**
 * Get search suggestions (product names only)
 * @param query - Search term
 * @returns Array of product names matching the search query
 */
export const suggestions = async (
  query: string,
  gender?: string,
  isSale?:string,
): Promise<string[]> => {
  const params: Record<string, string> = {};

  if (gender) {
    params.gender = gender;
  }
  if(isSale){
    params.isSale=isSale
  }
  params.q = query;

  const response = await apiClient.get<ApiResponse<string[]>>(
    '/api/products/suggestions',
    {
      params,
    }
  );
  return response.data.data;
};

