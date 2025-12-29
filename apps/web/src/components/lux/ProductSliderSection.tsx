'use client';

import { useRef } from 'react';

import { ProductCard } from './ProductCard';
import type { ProductCardProps } from './types';

type ProductSliderSectionProps = {
  title: React.ReactNode;
  description: string;
  products: ProductCardProps[];
};

export function ProductSliderSection({
  title,
  description,
  products,
}: ProductSliderSectionProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const container = sliderRef.current;
    if (!container) return;
    const cardWidth = 424; // xấp xỉ width card + gap
    const delta = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-[1400px] overflow-hidden px-6 py-24">
      <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between border-b border-transparent pb-6">
        <div>
          <h2 className="text-4xl font-bold">{title}</h2>
          <p className="mt-2 text-gray-500">{description}</p>
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            className="group rounded-full border border-white/10 p-3 transition-all hover:bg-amber-500 hover:text-black"
          >
            <span className="sr-only">Trước</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            className="group rounded-full border border-white/10 p-3 transition-all hover:bg-amber-500 hover:text-black"
          >
            <span className="sr-only">Tiếp</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth px-4 pt-2 pb-12 md:px-0"
      >
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </section>
  );
}
