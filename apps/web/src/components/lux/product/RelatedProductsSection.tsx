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
              icon="👟"
              title={product.name}
              subtitle={product.shortDescription ?? product.description}
              priceLabel={new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(product.priceCurrent)}
              img={product.images?.[0]?.src}
              badge={
                product.badge
                  ? {
                      label: product.badge,
                      variant: 'hot',
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
