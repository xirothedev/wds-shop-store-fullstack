'use client';

import { useQuery } from '@tanstack/react-query';

import { CartItem } from '@/types/product';

import { OrderItemCard } from './OrderItemCard';

export interface ConfirmOrderProps {
  orderId: string;
}

export function ConfirmOrder() {
  const { data } = useQuery({
    queryKey: ['getOrderItems'],
    queryFn: () => {
      const data = localStorage.getItem('orderItems');
      if (!data) throw Error('No Item selected');
      console.log(data);
      const cartItems: CartItem[] = JSON.parse(data);
      console.log(cartItems);
      return cartItems;
    },
  });

  return (
    <>
      {data && (
        <>
          <h1 className="mt-16 mb-16 text-center">
            <span className="text-center text-4xl font-bold">THÔNG TIN </span>
            <span className="text-centers bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-bold text-transparent">
              ĐẶT HÀNG
            </span>
          </h1>
          <h1 className="mb-16 text-center">
            <span className="text-center text-4xl font-bold">ĐƠN </span>
            <span className="text-centers bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-bold text-transparent">
              ĐẶT HÀNG
            </span>
          </h1>
          <div className="grid w-full grid-cols-1 items-center overflow-hidden rounded-xl px-2 py-4 text-center md:grid-cols-[20%_25%_20%_20%_15%] md:grid-rows-1 md:p-4">
            <p className="col-span-2">Sản phẩm</p>
            <p className="hidden md:block">Đơn giá</p>
            <p className="hidden md:block">Số lượng</p>
            <p className="hidden md:block">Thành tiền</p>
          </div>
          <div>
            {data.map((item: CartItem) => {
              return (
                <div key={item.cartItemId} className="bg-white/5">
                  <OrderItemCard product={item} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
