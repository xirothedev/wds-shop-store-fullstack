'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { CreateOrderDto, ordersApi } from '@/lib/api/orders.api';
import { paymentApi } from '@/lib/api/payment.api';
import { CartItem } from '@/types/product';

import { OrderItemCard } from './OrderItemCard';

export interface ConfirmOrderProps {
  orderId: string;
}

export function ConfirmOrder() {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { data } = useQuery({
    queryKey: ['getOrderItems'],
    queryFn: () => {
      const data = localStorage.getItem('orderItems');
      if (!data) throw Error('No Item selected');
      console.log(data);
      const cartItems: CartItem[] = JSON.parse(data);
      console.log(cartItems);

      setTotalAmount(
        cartItems.reduce((sum, currentValue) => {
          return sum + currentValue.priceCurrent * currentValue.quantity;
        }, 0)
      );

      return cartItems;
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: async (order) => {
      // After creating order, initiate payment
      const paymentResponse = await paymentApi.initiatePayment(order.id);
      console.log(paymentResponse);

      if (paymentResponse.transaction.paymentUrl) {
        window.location.href = paymentResponse.transaction.paymentUrl;
      } else {
        console.error('No payment URL received');
      }
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      // Handle error, e.g., show toast
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const address = formData.get('shipping-address');
    const state = formData.get('shipping-state');
    const city = formData.get('shipping-city');
    const country = formData.get('shipping-country');
    const postal = formData.get('shipping-postal');

    console.log(address?.toString());
    console.log(state?.toString());
    console.log(city?.toString());
    console.log(country?.toString());
    console.log(postal?.toString());

    const obj: CreateOrderDto = {
      items: (data as CartItem[]).map((item) => {
        return {
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
        };
      }),
      shippingAddress: address?.toString(),
      shippingState: state?.toString(),
      shippingCity: city?.toString(),
      shippingCountry: country?.toString(),
      shippingZip: postal?.toString(),
      shippingFee: 0,
      discountValue: 0,
    };

    createOrderMutation.mutate(obj);
  };

  return (
    <>
      {data && (
        <form onSubmit={handleSubmit}>
          <h1 className="mt-8 mb-8 text-center">
            <span className="text-center text-4xl font-bold">THÔNG TIN </span>
            <span className="text-centers bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-bold text-transparent">
              GIAO HÀNG
            </span>
          </h1>
          {/* 
                    - Địa chỉ giao hàng
                    - Phường
                    - Thành Phố 
                    - ZIP/Postal Code
                */}
          <div
            id="shipping-detail"
            className="grid gap-x-3 gap-y-2 md:grid-cols-2"
          >
            <div className="col-span-2">
              <label htmlFor="shipping-address" className="pl-4 text-2xl">
                Địa Chỉ
              </label>
              <br></br>
              <input
                className="w-full rounded-xl border border-white/20 px-6 py-4 text-xl outline-0 hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
                placeholder="123 Đường ABC"
                id="shipping-address"
                name="shipping-address"
              ></input>
            </div>
            <div>
              <label htmlFor="shipping-state" className="pl-4 text-2xl">
                Phường
              </label>
              <br></br>
              <input
                className="w-full rounded-xl border border-white/20 px-6 py-4 text-xl outline-0 hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
                placeholder="Phường Sài Gòn"
                id="shipping-state"
                name="shipping-state"
              ></input>
            </div>
            <div>
              <label htmlFor="shipping-city" className="pl-4 text-2xl">
                Thành Phố
              </label>
              <br></br>
              <input
                className="w-full rounded-xl border border-white/20 px-6 py-4 text-xl outline-0 hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
                placeholder="Thành Phố Hồ Chí Minh"
                id="shipping-city"
                name="shipping-city"
              ></input>
            </div>
            <div>
              <label htmlFor="shipping-country" className="pl-4 text-2xl">
                Quốc Gia
              </label>
              <br></br>
              <input
                className="w-full rounded-xl border border-white/20 px-6 py-4 text-xl outline-0 hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
                placeholder="Việt Nam"
                id="shipping-country"
                name="shipping-country"
              ></input>
            </div>
            <div>
              <label htmlFor="shipping-postal" className="pl-4 text-2xl">
                Mã ZIP/Postal
              </label>
              <br></br>
              <input
                className="w-full rounded-xl border border-white/20 px-6 py-4 text-xl outline-0 hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
                placeholder="00700"
                id="shipping-postal"
                name="shipping-postal"
              ></input>
            </div>
          </div>
          <h2 className="mt-8 mb-8 text-center">
            <span className="text-center text-4xl font-bold">ĐƠN </span>
            <span className="text-centers bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-4xl font-bold text-transparent">
              ĐẶT HÀNG
            </span>
          </h2>
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
          <div className="my-4 flex w-full flex-row justify-between px-2 text-2xl">
            <p>Tổng thanh toán:</p>
            <p>
              {Math.round(totalAmount) &&
                new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  maximumFractionDigits: 0,
                }).format(Math.round(totalAmount))}
            </p>
          </div>

          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-linear-to-r from-amber-400 to-amber-500 px-4 py-2 text-right text-2xl disabled:opacity-50"
            >
              Xác nhận và Đặt đơn
            </button>
          </div>
        </form>
      )}
    </>
  );
}
