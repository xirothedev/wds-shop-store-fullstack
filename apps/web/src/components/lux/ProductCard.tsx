import type React from 'react';

import { Button } from './Button';
import type { ProductCardProps } from './types';

export function ProductCard({
  icon,
  title,
  subtitle,
  priceLabel,
  badge,
}: ProductCardProps) {
  return (
    <div className="group min-w-[320px] shrink-0 cursor-pointer snap-center rounded-3xl border border-amber-500/20 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(251,191,36,0.25)] md:min-w-[400px]">
      <div className="relative mb-6 flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-white/5 to-white/10">
        <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
          {icon}
        </span>
        {badge ? (
          <div
            className={`absolute top-4 ${
              badge.variant === 'hot' || badge.variant === 'new'
                ? 'left-4'
                : 'right-4'
            } rounded px-2 py-1 text-[10px] font-black ${
              badge.variant === 'hot'
                ? 'bg-amber-500 text-black'
                : badge.variant === 'new'
                  ? 'border border-amber-500 text-amber-500'
                  : 'bg-black/50 text-amber-400'
            }`}
          >
            {badge.label}
          </div>
        ) : null}
      </div>
      <h3 className="mb-1 text-xl font-bold">{title}</h3>
      {subtitle ? (
        <p className="mb-4 text-sm text-gray-400">{subtitle}</p>
      ) : null}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-amber-500">{priceLabel}</span>
        <Button variant="ghost">
          <span className="sr-only">Thêm vào giỏ</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
