'use client';

import { useQuery } from '@tanstack/react-query';

import { getAllCartItem } from '@/lib/api/cart.api';
import { CartItem } from '@/types/product';

import { CartItemCard } from './CartItemCard';

export function CartItemList() {
  const { data, isLoading, error } = useQuery<CartItem[], Error>({
    queryKey: ['get-all'],
    queryFn: getAllCartItem,
  });

  return (
    <>
      {isLoading && <p>Loading</p>}
      {error && <p>{error.message}</p>}
      {data && (
        <table className="w-full max-w-7xl">
          <colgroup>
            <col className="w-[20%]"></col>
            <col className="w-[15%]"></col>
            <col className="w-[15%]"></col>
            <col className="w-[30%]"></col>
            <col className="w-[20%]"></col>
          </colgroup>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Chi tiết</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {data.map((product: CartItem) => (
              <CartItemCard key={product.id} {...product} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
