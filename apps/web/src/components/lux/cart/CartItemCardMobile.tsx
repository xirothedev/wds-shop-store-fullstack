'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

import { type CartItem } from '@/types/product';

export function CartItemCardMobile(product: CartItem) {
  const [quantity, setQuantity] = useState(product.quantity);

  return (
    <>
      <tr className="w-full overflow-hidden rounded-xl align-middle">
        <th className="pb-8">
          <label
            htmlFor={`select-mobile-${product.id}`}
            className="group cursor-pointer"
          >
            <input
              type="checkbox"
              id={`select-mobile-${product.id}`}
              className="peer sr-only"
            />
            <div className="h-6 w-6 rounded-xs bg-white/10 *:hidden peer-checked:bg-amber-500 peer-checked:*:block">
              <p className="m-auto text-center select-none">✓</p>
            </div>
          </label>
        </th>

        <td className="pb-8 align-middle">
          <Image
            alt="product image"
            src={product.images?.at(0)?.src as string}
            width={200}
            height={200}
            className="m-auto rounded-2xl"
          />
        </td>

        <td className="pr-4 pb-8 pl-4 align-middle">
          <div className="flex h-30 flex-col justify-between">
            <div>
              <p className="truncate">{product.name}</p>
              <div className="flex flex-row justify-between text-center">
                <div className="flex flex-col justify-center">
                  <p className="text-center align-middle">
                    Size: {product.size}
                  </p>
                </div>

                <div className="quantity-box flex h-10 w-30 flex-row items-center justify-around border border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                    className="flex h-5 w-5 cursor-pointer flex-col justify-center select-none"
                  >
                    <FaMinus className="m-auto" />
                  </button>

                  <p className="w-5 text-center select-none">{quantity}</p>

                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(q + 1, product.stock))
                    }
                    type="button"
                    className="flex h-5 w-5 cursor-pointer flex-col justify-center select-none"
                  >
                    <FaPlus className="m-auto" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <p>
                Đơn giá:{' '}
                {Math.round(product.priceCurrent) &&
                  new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0,
                  }).format(Math.round(product.priceCurrent))}
              </p>
              <button
                type="button"
                className="cursor-pointer text-amber-500 active:text-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
