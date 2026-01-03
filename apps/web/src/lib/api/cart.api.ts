import { CartItem } from '@/types/product';

import { apiClient } from './axios';

export interface CartItemEditRequestDto {
  id: string;
  productId: string;
  quantity: number;
  size: string;
}

export const getAllCartItem = async (): Promise<CartItem[]> => {
  const res = await apiClient.get('/cart');
  const temp = res.data;
  const data = temp.data;

  console.log(data);

  return data.map((product: CartItem) => ({
    ...product,
    images: [
      {
        id: '',
        src: `https://cdn.wss.xirothedev.site/products/${product.id}/1.jpeg`,
        alt: '',
      },
    ],
  }));
};

export const deleteCartItem = async (itemId: string): Promise<void> => {
  console.log(itemId);
  await apiClient.delete(`/cart/items/${itemId}`);
};

export const updateCartItem = async (item: CartItemEditRequestDto) => {
  console.log(item);
  await apiClient.put(`/cart/items/${item.id}`, item);
};
