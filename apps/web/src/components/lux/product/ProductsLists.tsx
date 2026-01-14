'use client';

import InfiniteScroll from 'react-infinite-scroll-component';

import ProductsLoading from '@/app/products/loading';
import { Product } from '@/types/product';

import FilterProduct from './FilterProduct';
import { ProductListCard } from './ProductListCard';

type ProductsListsProps = {
  isLoading: boolean;
  products: Product[];
  router: any;
  loadMoreProducts: () => void;
  hasMore: boolean;
  filters: {
    gender?: 'MALE' | 'FEMALE' | 'UNISEX' | null;
    sale?: boolean;
    search?: string | null;
    sortBy?: string;
    sortValue?: string;
    orderBy?: string;
  };
};
const ProductsLists = ({
  isLoading,
  products,
  router,
  loadMoreProducts,
  hasMore,

  filters,
}: ProductsListsProps) => {
  return products.length === 0 ? (
    isLoading ? (
      <ProductsLoading />
    ) : (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="mx-auto max-w-xl rounded-lg border border-amber-200/40 bg-white/5 p-8 text-center">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-amber-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7h18M5 7v11a2 2 0 002 2h10a2 2 0 002-2V7M9 7V4a3 3 0 016 0v3"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-white">
            Không có sản phẩm nào
          </h3>
          <p className="text-sm text-gray-400">
            Không tìm thấy sản phẩm phù hợp.
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                router.back();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  ) : (
    <main className="min-h-screen pt-28">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            {filters.search
              ? `Kết quả tìm kiếm `
              : filters.gender === 'MALE'
                ? 'GIÀY NAM'
                : filters.gender === 'FEMALE'
                  ? 'GIÀY NỮ'
                  : filters.sale
                    ? 'SẢN PHẨM GIẢM GIÁ'
                    : 'TẤT CẢ'}{' '}
            <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {filters.search ? `` : ' SẢN PHẨM'}
            </span>
          </h1>
          <p className="text-gray-400">
            {filters.gender === 'MALE'
              ? 'Bộ sưu tập giày thể thao dành cho nam'
              : filters.gender === 'FEMALE'
                ? 'Bộ sưu tập giày thể thao dành cho nữ'
                : filters.sale
                  ? 'Những sản phẩm đang được giảm giá'
                  : 'Khám phá bộ sưu tập giày thể thao cao cấp của chúng tôi'}
          </p>
          <FilterProduct />
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
          <div className="] grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductListCard key={product.id} product={product} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </main>
  );
};

export default ProductsLists;
