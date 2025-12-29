import { notFound } from 'next/navigation';

import { ProductDetailPage } from '@/components/lux/product/ProductDetailPage';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(slug);

  return <ProductDetailPage product={product} related={related} />;
}
