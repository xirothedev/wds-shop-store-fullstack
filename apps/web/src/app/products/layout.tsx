import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tất cả sản phẩm',
  description:
    'Khám phá bộ sưu tập giày thể thao cao cấp của chúng tôi. Đa dạng mẫu mã, chất lượng tốt nhất cho nam, nữ và unisex.',
  openGraph: {
    title: 'Tất cả sản phẩm | LUX Sneakers',
    description:
      'Khám phá bộ sưu tập giày thể thao cao cấp của chúng tôi. Đa dạng mẫu mã, chất lượng tốt nhất.',
    url: '/products',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tất cả sản phẩm | LUX Sneakers',
    description: 'Khám phá bộ sưu tập giày thể thao cao cấp của chúng tôi.',
    images: ['/og-image.png'],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
