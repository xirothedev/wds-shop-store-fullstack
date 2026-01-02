import Image from 'next/image';
import Link from 'next/link';

import type { Product } from '@/types/product';

type ProductListCardProps = {
  product: Product;
};

export function ProductListCard({ product }: ProductListCardProps) {
  const mainImage = product.images?.[0];
  const priceFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(product.priceCurrent);

  const originalPriceFormatted =
    product.priceOriginal &&
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(product.priceOriginal);

  const getBadgeVariant = (badge?: string): 'hot' | 'new' | 'default' => {
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

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-amber-500/20 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(251,191,36,0.25)]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-white/5 to-white/10">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={ product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl transition-transform duration-500 group-hover:scale-110">
              👟
            </span>
          </div>
        )}

        {product.badge && (
          <div
            className={`absolute top-4 ${
              getBadgeVariant(product.badge) === 'hot' ||
              getBadgeVariant(product.badge) === 'new'
                ? 'left-4'
                : 'right-4'
            } rounded px-2 py-1 text-[10px] font-black ${
              getBadgeVariant(product.badge) === 'hot'
                ? 'bg-amber-500 text-black'
                : getBadgeVariant(product.badge) === 'new'
                  ? 'border border-amber-500 text-amber-500'
                  : 'bg-black/50 text-amber-400'
            }`}
          >
            {product.badge}
          </div>
        )}

        {product.isLimited && (
          <div className="absolute top-4 right-4 rounded border border-red-500/50 bg-red-500/20 px-2 py-1 text-[10px] font-black text-red-400">
            LIMITED
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 text-xl font-bold">{product.name}</h3>

        {product.shortDescription && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-400">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-500">
                {priceFormatted}
              </span>
              {product.priceOriginal &&
                product.priceOriginal > product.priceCurrent && (
                  <span className="text-sm text-gray-500 line-through">
                    {originalPriceFormatted}
                  </span>
                )}
            </div>
            {product.ratingValue && product.ratingCount > 0 && (
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
                <span className="font-medium">{product.ratingValue}</span>
                <span className="text-gray-500">
                  ({product.ratingCount.toLocaleString('vi-VN')})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
