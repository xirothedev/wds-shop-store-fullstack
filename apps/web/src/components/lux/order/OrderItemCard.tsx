import Image from 'next/image';

import { type CartItem } from '@/types/product';

export interface CardInputProps {
  product: CartItem;
}

export function OrderItemCard({ product }: CardInputProps) {
  return (
    <div className="grid w-full grid-cols-[40%_40%_20%] grid-rows-[50%_20%_30%] items-center overflow-hidden rounded-xl px-2 py-4 text-center md:grid-cols-[20%_25%_20%_20%_15%] md:grid-rows-1 md:p-4">
      <div className="row-span-3 flex justify-center md:col-span-1 md:row-span-1">
        <Image
          alt="product image"
          src={product.images?.at(0)?.src as string}
          width={300}
          height={300}
          className="aspect-square rounded-2xl"
        />
      </div>

      <div className="product-info-wrapper col-span-2 ml-2 flex h-full w-full flex-col text-left md:col-span-1 md:items-center md:justify-center">
        <span>
          <a
            className="block truncate hover:text-amber-500"
            href={`/products/${product.slug}`}
          >
            {product.name}
          </a>
          <p className="">Size: {product.size}</p>
        </span>
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

      <div className="quantity-wrapper row-span-2 flex h-full w-full flex-row justify-end text-right md:justify-center md:text-center">
        <div className="quantity-box mt-auto ml-auto flex h-10 w-12 flex-col items-center justify-around rounded-xl border border-white/10 md:m-auto">
          <p className="text-center select-none">{product.quantity}</p>
        </div>
      </div>

      <div className="price-wrapper ml-2 hidden text-left align-text-bottom md:ml-0 md:block md:text-center">
        <p className="text-left md:text-center">
          {Math.round(product.priceCurrent * product.quantity) &&
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(Math.round(product.priceCurrent * product.quantity))}
        </p>
      </div>
    </div>
  );
}
