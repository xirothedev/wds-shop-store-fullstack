import Image from 'next/image';
import Link from 'next/link';

import { Button } from './Button';
import type { ProductCardProps } from './types';
const getBadgeVariant = (badge?: string | any): 'hot' | 'new' | 'default' => {
  if (!badge) return 'default';
  const upperBadge = badge.toUpperCase();
  if (upperBadge.includes('HOT') || upperBadge.includes('BEST SELLER')) {
    return 'hot';
  }
  if (upperBadge.includes('NEW')) {
    return 'new';
  }
  return 'default';
};
const priceFormatted = (priceCurrent: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(priceCurrent);
};

export function ProductCard({
  name,
  slug,
  priceCurrent,
  badge,
  images,
  ratingCount,
  ratingValue,
}: ProductCardProps) {
  const badgeText = typeof badge === 'string' ? badge : badge?.label;
  const firstImage = images?.[0] || { src: '/placeholder.png', alt: name };

  return (
    <Link href={`/products/${slug}`}>
      <div className="group min-w-[320px] shrink-0 cursor-pointer snap-center rounded-3xl border border-amber-500/20 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(251,191,36,0.25)] md:min-w-[400px]">
        <div className="relative mb-6 flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-white/5 to-white/10">
          <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
            <Image
              src={firstImage.src}
              alt={firstImage.alt}
              className="h-full w-full select-none"
              fill
            />
          </span>
          {badgeText && (
            <div
              className={`absolute top-4 ${
                getBadgeVariant(badgeText) === 'hot' ||
                getBadgeVariant(badgeText) === 'new'
                  ? 'left-4'
                  : 'right-4'
              } rounded px-2 py-1 text-[10px] font-black ${
                getBadgeVariant(badgeText) === 'hot'
                  ? 'bg-amber-500 text-black'
                  : getBadgeVariant(badgeText) === 'new'
                    ? 'border border-amber-500 text-amber-500'
                    : 'bg-black/50 text-amber-400'
              }`}
            >
              {badgeText}
            </div>
          )}
        </div>
        <h3 className="mb-1 text-xl font-bold">{name}</h3>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-500">
            {priceFormatted(priceCurrent)}
          </span>
          {ratingValue && ratingCount && (
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-amber-500"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-medium">{ratingValue}</span>
              <span className="text-gray-500">
                ({ratingCount.toLocaleString('vi-VN')})
              </span>
            </div>
          )}
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
    </Link>
  );
}
