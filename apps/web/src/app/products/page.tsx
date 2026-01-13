'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';
import ProductsLists from '@/components/lux/product/ProductsLists';
import { getAllProducts } from '@/lib/products';
import type { Product } from '@/types/product';

import ProductsLoading from './loading';
import FilterProduct from '@/components/lux/product/FilterProduct'; 

const ITEMS_PER_PAGE = 12;

export function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Get filters from URL params
  const gender = searchParams.get('gender') as
    | 'MALE'
    | 'FEMALE'
    | 'UNISEX'
    | null;
  const sale = searchParams.get('sale') === 'true';
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy');
  const sortValue = searchParams.get('sortValue');
  const orderBy = searchParams.get('orderBy');
  // Memoize filters to prevent infinite loops
  const filters = useMemo(
    () => ({
      ...(gender && { gender }),
      ...(sale && { sale: true }),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortValue && { sortValue }),
      ...(orderBy && { orderBy }),
    }),
    [gender, sale, search, sortBy, sortValue, orderBy]
  );

  const loadMoreProducts = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { products: newProducts, hasMore: more } = await getAllProducts(
        page,
        ITEMS_PER_PAGE,
        filters
      );

      if (Array.isArray(newProducts)) {
        setProducts((prev) => [...prev, ...newProducts]);
        setHasMore(more);
        setPage((prev) => prev + 1);
      } else {
        console.error('getAllProducts returned invalid products:', newProducts);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, filters]);

  useEffect(() => {
    // Reset and load initial products when filters change
    const loadInitialProducts = async () => {
      setIsLoading(true);
      try {
        const { products: initialProducts, hasMore: more } =
          await getAllProducts(1, ITEMS_PER_PAGE, filters);

        if (Array.isArray(initialProducts)) {
          setProducts(initialProducts);
          setHasMore(more);
          setPage(2);
        } else {
          console.error(
            'getAllProducts returned invalid products:',
            initialProducts
          );
          setProducts([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading initial products:', error);
        setProducts([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProducts();
  }, [filters]);

  return (
    <>
      <LuxNavbar links={navLinks} cartCount={3} />
     
      <ProductsLists
        isLoading={isLoading}
        products={products}
        router={router}
        loadMoreProducts={loadMoreProducts}
        hasMore={hasMore}
       
        filters={filters}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
