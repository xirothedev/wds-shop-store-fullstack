import { type CartItem,Product } from '@/types/product';

export interface itemInput extends Product {
  productSlug: string;
  size: string;
  price: number;
  quantity: number;
}

export function CartItem(_item: itemInput) {
  return <></>;
}
