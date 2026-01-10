import { ProductCard } from '@/components/lux/ProductCard';
import { RevealOnScroll } from '@/components/lux/RevealOnScroll';
import type { Product } from '@/types/product';

type RelatedProductsSectionProps = {
  products: Product[];
};

export function RelatedProductsSection({
  products,
}: RelatedProductsSectionProps) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <RevealOnScroll>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              SẢN PHẨM{' '}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                LIÊN QUAN
              </span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Gợi ý thêm những lựa chọn phù hợp với phong cách của bạn
            </p>
          </div>
        </div>

        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              priceCurrent={product.priceCurrent}
              images={product.images ?? []}
              badge={product.badge}
              ratingCount={product.ratingCount}
              ratingValue={product.ratingValue}
            />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
