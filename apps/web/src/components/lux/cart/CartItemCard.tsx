'use client';

import Image from 'next/image';
import { useState } from 'react';

import { type CartItem } from '@/types/product';

export function CartItemCard(product: CartItem) {
  const [quantity, setQuantity] = useState(product.quantity);

  return (
    <>
      <tr className="w-full content-center items-center rounded-xl border border-white/10 pt-2 pb-2">
        <td className="content-center">
          <Image
            alt="product image"
            src={product.images?.at(0)?.src as string}
            width={200}
            height={200}
            className=""
          />
        </td>

        <td className="product-info-wrapper text-center">
          <p className="">{product.name}</p>
          <p className="">Size: {product.size}</p>
        </td>

        <td className="quantity-wrapper text-center">
          <div className="quantity-box mx-auto flex w-32 flex-row items-center justify-around border border-white/10">
            <button
              onClick={() => setQuantity((q) => Math.max(0, q - 1))}
              className="h-8 w-8 cursor-pointer select-none"
            >
              -
            </button>

            <div className="quantity-divider h-6 w-2 border-l border-white/10"></div>
            <p className="w-8 text-center select-none">{quantity}</p>
            <div className="quantity-divider h-6 w-2 border-l border-white/10"></div>

            <button
              onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
              className="h-8 w-8 cursor-pointer select-none"
            >
              +
            </button>
          </div>
        </td>

        <td className="price-wrapper text-center">
          <p className="m-5 text-center">
            {Math.round(product.priceCurrent * quantity)}
          </p>
        </td>

        <td className="delete-button-wrapper">
          <button className="w-full text-center">Xóa</button>
        </td>
      </tr>
    </>
  );
}
