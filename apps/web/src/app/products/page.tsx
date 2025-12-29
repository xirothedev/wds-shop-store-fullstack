'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';
import { ProductListCard } from '@/components/lux/product/ProductListCard';
import { getAllProducts } from '@/lib/products';
import type { Product } from '@/types/product';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Get filters from URL params
  const gender = searchParams.get('gender') as
    | 'MALE'
    | 'FEMALE'
    | 'UNISEX'
    | null;
  const sale = searchParams.get('sale') === 'true';

  const filters = {
    ...(gender && { gender }),
    ...(sale && { sale: true }),
  };

  const loadMoreProducts = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    // Simulate API delay for better UX
    setTimeout(() => {
      const { products: newProducts, hasMore: more } = getAllProducts(
        page,
        ITEMS_PER_PAGE,
        filters
      );

      setProducts((prev) => [...prev, ...newProducts]);
      setHasMore(more);
      setPage((prev) => prev + 1);
      setIsLoading(false);
    }, 500);
  }, [page, isLoading, gender, sale]);

  useEffect(() => {
    // Reset and load initial products when filters change
    setIsLoading(true);
    const { products: initialProducts, hasMore: more } = getAllProducts(
      1,
      ITEMS_PER_PAGE,
      filters
    );
    setProducts(initialProducts);
    setHasMore(more);
    setPage(2);
    setIsLoading(false);
  }, [gender, sale]);

  return (
    <>
      <LuxNavbar links={navLinks} cartCount={3} />

      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold">
              {gender === 'MALE'
                ? 'GIÀY NAM'
                : gender === 'FEMALE'
                  ? 'GIÀY NỮ'
                  : sale
                    ? 'SẢN PHẨM GIẢM GIÁ'
                    : 'TẤT CẢ'}{' '}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                SẢN PHẨM
              </span>
            </h1>
            <p className="text-gray-400">
              {gender === 'MALE'
                ? 'Bộ sưu tập giày thể thao dành cho nam'
                : gender === 'FEMALE'
                  ? 'Bộ sưu tập giày thể thao dành cho nữ'
                  : sale
                    ? 'Những sản phẩm đang được giảm giá'
                    : 'Khám phá bộ sưu tập giày thể thao cao cấp của chúng tôi'}
            </p>
          </div>

          {/* Products Grid with Infinite Scroll */}
          <InfiniteScroll
            dataLength={products.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="col-span-full flex justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
                  <p className="text-sm text-gray-400">
                    Đang tải thêm sản phẩm...
                  </p>
                </div>
              </div>
            }
            endMessage={
              <div className="col-span-full py-8 text-center">
                <p className="text-gray-400">
                  Bạn đã xem hết tất cả sản phẩm rồi! 🎉
                </p>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductListCard key={product.id} product={product} />
              ))}
            </div>
          </InfiniteScroll>

          {/* Empty state */}
          {!isLoading && products.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400">Không có sản phẩm nào.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
