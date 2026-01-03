'use client';

import { UseMutateFunction } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { useDebounce } from 'react-use';

import { CartItemEditRequestDto } from '@/lib/api/cart.api';
import { type CartItem } from '@/types/product';

export interface CardInputProps {
  product: CartItem;
  deleteItem: UseMutateFunction<
    void,
    AxiosError<unknown, any>,
    string,
    unknown
  >;
  editItem: UseMutateFunction<
    void,
    AxiosError<unknown, any>,
    CartItemEditRequestDto
  >;
  isSelected: boolean;
  onSelect: () => void;
  deleteSelectedItem: () => void;
}

export function CartItemCard({
  product,
  deleteItem,
  editItem,
  isSelected,
  onSelect,
  deleteSelectedItem,
}: CardInputProps) {
  const [quantity, setQuantity] = useState(product.quantity);
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);

  useDebounce(
    async () => {
      if (quantity === 0) {
        deleteItem(product.cartItemId);
        deleteSelectedItem();
      } else if (
        quantity !== product.quantity &&
        pendingQuantity === quantity
      ) {
        const obj: CartItemEditRequestDto = {
          id: product.cartItemId,
          productId: product.id,
          quantity: quantity,
          size: product.size,
        };
        await editItem(obj);
        setPendingQuantity(null);
      }
    },
    300,
    [quantity]
  );

  useEffect(() => {
    setQuantity(product.quantity);
    setPendingQuantity(null);
  }, [product.quantity]);

  return (
    <div className="grid w-full grid-cols-[10%_30%_40%_20%] grid-rows-[50%_20%_30%] items-center overflow-hidden rounded-xl bg-white/5 p-4 text-center md:grid-cols-[5%_15%_25%_15%_15%_15%_10%] md:grid-rows-1">
      <div className="row-span-3 flex justify-center md:col-span-1 md:row-span-1">
        <label
          htmlFor={`select-${product.id + product.size}`}
          className="group cursor-pointer"
        >
          <input
            type="checkbox"
            id={`select-${product.id + product.size}`}
            className="peer sr-only"
            checked={isSelected}
            onChange={onSelect}
          />
          <div className="h-6 w-6 rounded-xs bg-white/10 *:hidden peer-checked:bg-amber-500 peer-checked:*:block">
            <p className="m-auto text-center select-none">✓</p>
          </div>
        </label>
      </div>

      <div className="row-span-3 flex justify-center md:col-span-1 md:row-span-1">
        <Image
          alt="product image"
          src={product.images?.at(0)?.src as string}
          width={200}
          height={200}
          className="rounded-2xl"
        />
      </div>

      <div className="product-info-wrapper col-span-2 ml-2 flex h-full w-full flex-col text-left md:col-span-1 md:justify-center">
        <a className="block truncate" href={`/products/${product.slug}`}>
          {product.name}
        </a>
        <p className="">Size: {product.size}</p>
      </div>

      <div className="price-wrapper row-span-2 ml-2 flex h-full w-full flex-col justify-end text-left md:row-span-1 md:ml-0 md:justify-center md:text-center">
        <p className="text-left md:text-center">
          {Math.round(product.priceCurrent) &&
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(Math.round(product.priceCurrent))}
        </p>
      </div>

      <div className="quantity-wrapper flex flex-row justify-center text-right md:text-center">
        <div className="quantity-box my-auto ml-auto flex w-16 flex-row items-center justify-around rounded-xl border border-white/10 md:mr-auto">
          <button
            type="button"
            onClick={() => {
              const newQty = quantity - 1;
              setQuantity(Math.max(0, newQty));
              setPendingQuantity(Math.max(0, newQty));
            }}
            className="h-8 w-8 cursor-pointer select-none"
          >
            <FaMinus className="m-auto h-2 w-2" />
          </button>

          <p className="w-8 text-center select-none">{quantity}</p>

          <button
            onClick={() => {
              const newQty = quantity + 1;
              setQuantity(Math.min(newQty, product.stock));
              setPendingQuantity(Math.min(newQty, product.stock));
            }}
            type="button"
            className="h-8 w-8 cursor-pointer select-none"
          >
            <FaPlus className="m-auto h-2 w-2" />
          </button>
        </div>
      </div>

      <div className="price-wrapper ml-2 hidden text-left align-text-bottom md:ml-0 md:block md:text-center">
        <p className="text-left md:text-center">
          {Math.round(product.priceCurrent * quantity) &&
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(Math.round(product.priceCurrent * quantity))}
        </p>
      </div>

      <div className="delete-button-wrapper">
        <button
          type="button"
          onClick={() => {
            deleteItem(product.cartItemId);
            deleteSelectedItem();
          }}
          disabled={product.cartItemId === undefined}
          className="w-full cursor-pointer text-right hover:text-red-500 disabled:opacity-50 md:text-center"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
