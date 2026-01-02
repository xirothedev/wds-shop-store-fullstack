'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

import { type CartItem } from '@/types/product';

export function CartItemCard(product: CartItem) {
  const [quantity, setQuantity] = useState(product.quantity);

  return (
    <div className="grid-row-[10%_10%_80%] md:grid-row-1 grid w-full grid-cols-[10%_30%_30%_30%] items-center overflow-hidden rounded-xl bg-white/5 p-4 text-center md:grid-cols-[5%_15%_25%_15%_15%_20%_5%]">
      <div className="row-span-3 flex justify-center md:col-span-1 md:row-span-1">
        <label
          htmlFor={`select-${product.id + product.size}`}
          className="group cursor-pointer"
        >
          <input
            type="checkbox"
            id={`select-${product.id + product.size}`}
            className="peer sr-only"
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

      <div className="product-info-wrapper col-span-2 ml-0 ml-2 text-left md:col-span-1">
        <a className="block truncate" href={`/products/${product.slug}`}>
          {product.name}
        </a>
        <p className="">Size: {product.size}</p>
      </div>

      <div className="price-wrapper ml-2 text-left md:ml-0 md:text-center">
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
        <div className="quantity-box my-auto ml-auto flex w-16 flex-row items-center justify-around border border-white/10 md:mr-auto">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(0, q - 1))}
            className="h-8 w-8 cursor-pointer select-none"
          >
            <FaMinus className="m-auto h-2 w-2" />
          </button>

          <p className="w-8 text-center select-none">{quantity}</p>

          <button
            onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
            type="button"
            className="h-8 w-8 cursor-pointer select-none"
          >
            <FaPlus className="m-auto h-2 w-2" />
          </button>
        </div>
      </div>

      <div className="price-wrapper ml-2 text-left md:ml-0 md:text-center">
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
          className="w-full cursor-pointer text-right hover:text-amber-500 md:text-center"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
