'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';

import {
  CartItemEditRequestDto,
  deleteCartItem,
  getAllCartItem,
  updateCartItem,
} from '@/lib/api/cart.api';
import { CartItem } from '@/types/product';

import { CartItemCard } from './CartItemCard';

export function CartItemList() {
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(
    new Map()
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const query = useQuery<CartItem[], Error>({
    queryKey: ['cart', 'items'],
    queryFn: getAllCartItem,
  });

  const deleteItem = useMutation<void, AxiosError, string>({
    mutationFn: deleteCartItem,
    onSuccess: async () => {
      await query.refetch();
    },
  });

  const editItem = useMutation<void, AxiosError, CartItemEditRequestDto>({
    mutationFn: updateCartItem,
    onSuccess: async () => {
      await query.refetch();
      console.log(query.isFetching);
    },
  });

  useEffect(() => {
    setTotalAmount(
      [...selectedItems].reduce<number>((sum, [_, amount]) => {
        return sum + amount;
      }, 0)
    );
  }, [selectedItems]);

  const handleSelectItem = (itemId: string, amount: number) => {
    console.log(1);
    setSelectedItems((prev) => {
      const newSet = new Map(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.set(itemId, amount);
      }
      return newSet;
    });
  };

  const deleteSelectedItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Map(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    console.log(totalAmount);
  }, [totalAmount]);

  const handleSelectAll = (checked: boolean) => {
    if (query.data) {
      setSelectedItems(
        checked
          ? new Map(
              query.data.map((item) => [
                item.cartItemId,
                item.priceCurrent * item.quantity,
              ])
            )
          : new Map()
      );
    }
  };

  const allSelected = useMemo(() => {
    if (!query.data || query.data.length === 0) return false;
    return query.data.every((item) => selectedItems.has(item.cartItemId));
  }, [query.data, selectedItems]);

  const isIndeterminate = useMemo(() => {
    if (!query.data || query.data.length === 0) return false;
    return selectedItems.size > 0 && selectedItems.size < query.data.length;
  }, [query.data, selectedItems]);

  const handlePayment = () => {
    console.log('PAYMENT', Array.from(selectedItems));
  };

  return (
    <>
      {query.isLoading && (
        <div className="relative h-75 w-full">
          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
            fill="#ffffff"
            width="50px"
            height="50px"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z" />
          </svg>
        </div>
      )}
      {query.error && <p>{query.error.message}</p>}
      {query.data && !query.isLoading && (
        <form
          className="flex w-full flex-col items-center gap-4"
          onSubmit={handlePayment}
        >
          <div className="grid w-full grid-cols-[10%_30%_30%_30%] content-center p-4 text-center font-medium md:grid-cols-[5%_15%_25%_15%_15%_15%_10%] md:pb-8">
            <div className="flex justify-center">
              <label htmlFor="select-all" className="group cursor-pointer">
                <input
                  type="checkbox"
                  id="select-all"
                  className="peer sr-only"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <div className="h-6 w-6 rounded-xs bg-white/10 *:hidden peer-checked:bg-amber-500 peer-checked:*:block">
                  <p className="m-auto text-center select-none">✓</p>
                </div>
              </label>
            </div>
            <div className="col-span-3 md:col-span-2">Sản phẩm</div>
            <div className="hidden md:block">Đơn giá</div>
            <div className="hidden md:block">Số lượng</div>
            <div className="hidden md:block">Thành tiền</div>
            <div className="hidden md:block">Thao tác</div>
          </div>
          <div className="flex w-full max-w-7xl flex-col gap-4">
            {query.data.map((product: CartItem) => (
              <CartItemCard
                key={product.cartItemId}
                product={product}
                deleteItem={deleteItem.mutate}
                editItem={editItem.mutate}
                isSelected={selectedItems.has(product.cartItemId)}
                onSelect={handleSelectItem}
                deleteSelectedItem={deleteSelectedItem}
                isUpdating={query.isFetching}
              />
            ))}
            {query.data.length === 0 && (
              <div className="grid h-50 items-center overflow-hidden rounded-xl bg-white/5 p-4 text-center">
                <p>Trong giỏ hàng của bạn không có sản phẩm?!</p>
              </div>
            )}
          </div>
          <div className="flex w-full flex-row justify-between px-2 text-2xl">
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
              disabled={selectedItems.size === 0}
              className="rounded-xl bg-linear-to-r from-amber-400 to-amber-500 px-4 py-2 text-right text-2xl"
            >
              Thanh Toán
            </button>
          </div>
        </form>
      )}
    </>
  );
}
