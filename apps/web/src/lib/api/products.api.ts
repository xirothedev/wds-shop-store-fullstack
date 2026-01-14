import type { Product } from '@/types/product';

import { apiClient } from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ProductPayload {
  name: string;
  description: string;
  priceCurrent: number;
  priceOriginal?: number;
  priceDiscount?: number;
  badge?: string;
  isPublished?: boolean;
  gender?: string;
  images: string[];
  sizeStocks?: { size: string; stock: number }[];
  category?: string;
}

export const getProducts = async (
  gender?: string,
  isSale?: string,
  search?: string,
  sortBy?: string,
  sortValue?: string,
  orderBy?: string
): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (gender) {
    params.gender = gender;
  }
  if (isSale !== undefined) {
    params.isSale = isSale;
  }
  if (search) {
    params.search = search;
  }
  if (sortBy) {
    params.sortBy = sortBy;
  }
  if (sortValue) {
    params.sortValue = sortValue;
  }
  if (orderBy) {
    params.orderBy = orderBy;
  }

  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/api/products',
    {
      params,
    }
  );

  return response.data.data;
};

export const getProductsForAdmin = async (
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
    '/api/products/admin',
    {
      params,
    }
  );

  return response.data.data;
};

export const getProductBySlug = async (
  slug: string
): Promise<Product | undefined> => {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/api/products/slug/${slug}`
  );
  return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/api/products/admin/${id}`
  );
  return response.data.data;
};
export const getRelatedProducts = async (slug: string): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    `/api/products/related/${slug}`
  );
  return response.data.data;
};
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    `/api/products/featured`
  );
  return response.data.data;
};

export const createProduct = async (
  payload: ProductPayload
): Promise<Product> => {
  const response = await apiClient.post<
    ApiResponse<{ success: boolean; message: string; data: Product }>
  >('/api/products', payload);

  return response.data.data.data;
};

export const updateProduct = async (
  id: string,
  payload: ProductPayload
): Promise<Product> => {
  const response = await apiClient.patch<
    ApiResponse<{ success: boolean; message: string; data: Product }>
  >(`/api/products/${id}`, payload);

  return response.data.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete<ApiResponse<{ success: boolean; message: string }>>(
    `/api/products/${id}`
  );
};
