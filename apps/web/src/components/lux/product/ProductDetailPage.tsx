'use client';

import { useMemo, useState } from 'react';

import { Breadcrumb } from '@/components/lux/Breadcrumb';
import { RevealOnScroll } from '@/components/lux/RevealOnScroll';
import type { Product, ProductImage } from '@/types/product';

import { ProductDetailsTabs } from './ProductDetailsTabs';
import { ProductInfoPanel } from './ProductInfoPanel';
import { ProductMediaGallery } from './ProductMediaGallery';
import { RelatedProductsSection } from './RelatedProductsSection';

type ProductDetailPageProps = {
  product: Product;
  related: Product[];
};

export function ProductDetailPage({
  product,
  related,
}: ProductDetailPageProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(
    product.images?.[0]?.id
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number>(1);

  const images: ProductImage[] = useMemo(
    () =>
      product.images && product.images.length > 0
        ? product.images
        : [
            {
              id: 'placeholder',
              src: '',
              alt: product.name,
            },
          ],
    [product.images, product.name]
  );

  const selectedImage =
    images.find((image) => image.id === selectedImageId) ?? images[0];

  const handleAddToCart = () => {
    // Tạm thời chỉ log ra console để chuẩn bị tích hợp store giỏ hàng
    console.log('ADD_TO_CART', {
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      size: selectedSizeId,
      quantity,
    });
  };

  const getMaxQuantity = () => {
    if (!selectedSizeId || !product.sizeStocks) return 10;
    const sizeStock = product.sizeStocks.find(
      (item) => item.size === selectedSizeId
    );
    return sizeStock ? sizeStock.stock : 10;
  };

  const handleIncreaseQuantity = () => {
    const maxQuantity = getMaxQuantity();
    setQuantity((prev) => Math.min(prev + 1, maxQuantity));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectSize = (size: string) => {
    setSelectedSizeId(size);
    // Reset quantity về 1 khi đổi size, hoặc giới hạn theo stock mới nếu quantity hiện tại > stock
    const sizeStock = product.sizeStocks?.find((item) => item.size === size);
    if (sizeStock) {
      setQuantity((prev) => Math.min(prev, sizeStock.stock || 1));
    } else {
      setQuantity(1);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sản phẩm', href: '/products' },
          { label: product.name },
        ]}
      />

      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-16">
        <div className="pointer-events-none absolute top-20 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

        <RevealOnScroll>
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <ProductMediaGallery
                product={product}
                selectedImage={selectedImage}
                thumbnails={images}
                onSelectImage={(image) => setSelectedImageId(image.id)}
              />
            </div>

            <div>
              <ProductInfoPanel
                product={product}
                selectedSize={selectedSizeId}
                quantity={quantity}
                maxQuantity={getMaxQuantity()}
                onSelectSize={handleSelectSize}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-10">
          <RevealOnScroll>
            <ProductDetailsTabs product={product} />
          </RevealOnScroll>
        </div>
      </section>

      <RelatedProductsSection products={related} />
    </>
  );
}
