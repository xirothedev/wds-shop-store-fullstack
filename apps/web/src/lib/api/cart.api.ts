import { CartItem } from '@/types/product';

import { apiClient } from './axios';

export const getAllCartItem = async (): Promise<CartItem[]> => {
  const res = await apiClient.get('/cart');
  const temp = res.data;
  const data = temp.data;

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
