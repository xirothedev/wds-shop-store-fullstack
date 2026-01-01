'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

import { type CartItem } from '@/types/product';

export function CartItemCard(product: CartItem) {
  const [quantity, setQuantity] = useState(product.quantity);

  return (
    <>
      <tr className="w-full content-center items-center overflow-hidden rounded-xl">
        <th className="pb-8">
          <label
            htmlFor={`select-${product.id}`}
            className="group cursor-pointer"
          >
            <input
              type="checkbox"
              id={`select-${product.id}`}
              className="peer sr-only"
            />
            <div className="h-6 w-6 rounded-xs bg-white/10 *:hidden peer-checked:bg-amber-500 peer-checked:*:block">
              <p className="m-auto text-center select-none">✓</p>
            </div>
          </label>
        </th>

        <td className="content-center pb-8">
          <Image
            alt="product image"
            src={product.images?.at(0)?.src as string}
            width={200}
            height={200}
            className="rounded-2xl"
          />
        </td>

        <td className="product-info-wrapper px-2 pb-8 text-left">
          <a className="truncate" href={`/products/${product.slug}`}>
            {product.name}
          </a>
          <p className="">Size: {product.size}</p>
        </td>

        <td className="price-wrapper pb-8 text-center">
          <p className="m-5 text-center">
            {Math.round(product.priceCurrent) &&
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(Math.round(product.priceCurrent))}
          </p>
        </td>

        <td className="quantity-wrapper pb-8 text-center">
          <div className="quantity-box mx-auto flex w-32 flex-row items-center justify-around border border-white/10">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              className="h-8 w-8 cursor-pointer select-none"
            >
              <FaMinus className="m-auto" />
            </button>

            <p className="w-8 text-center select-none">{quantity}</p>

            <button
              onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
              type="button"
              className="h-8 w-8 cursor-pointer select-none"
            >
              <FaPlus className="m-auto" />
            </button>
          </div>
        </td>

        <td className="price-wrapper pb-8 text-center">
          <p className="m-5 text-center">
            {Math.round(product.priceCurrent * quantity) &&
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(Math.round(product.priceCurrent * quantity))}
          </p>
        </td>

        <td className="delete-button-wrapper pb-8">
          <button
            type="button"
            className="w-full cursor-pointer text-center hover:text-amber-500"
          >
            Xóa
          </button>
        </td>
      </tr>
    </>
  );
}
