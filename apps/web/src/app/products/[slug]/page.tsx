import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetailPage } from '@/components/lux/product/ProductDetailPage';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
    };
  }

  const priceFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(product.priceCurrent);

  const description =
    product.shortDescription ||
    product.description ||
    `Mua ${product.name} với giá ${priceFormatted}. Chất lượng cao cấp, giao hàng nhanh.`;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].src
      : '/og-image.png';

  return {
    title: product.name,
    description,
    keywords: [
      product.name,
      'giày thể thao',
      product.category || 'sneakers',
      product.gender === 'MALE'
        ? 'giày nam'
        : product.gender === 'FEMALE'
          ? 'giày nữ'
          : 'giày unisex',
      'LUX Sneakers',
    ],
    openGraph: {
      title: `${product.name} | LUX Sneakers`,
      description,
      url: `/products/${slug}`,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | LUX Sneakers`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(slug);

  return <ProductDetailPage product={product} related={related} />;
}
