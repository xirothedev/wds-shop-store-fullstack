import type { Product } from '@/types/product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gold-phantom-react',
    slug: 'gold-phantom-react',
    name: 'Gold Phantom React',
    shortDescription: 'Dòng chạy bộ chuyên dụng với đệm phản hồi cao cấp.',
    description:
      'Gold Phantom React được thiết kế cho những runner cần sự ổn định, êm ái và bứt tốc. Upper lưới thoáng khí, midsole foam phản hồi năng lượng tối đa và outsole bám đường mạnh mẽ.',
    priceCurrent: 4_500_000,
    priceOriginal: 4_900_000,
    priceDiscount: 400_000,
    badge: 'BEST SELLER',
    ratingValue: 4.8,
    ratingCount: 128,
    isPublished: true,
    images: [
      {
        id: 'gold-phantom-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Gold Phantom React - phối màu vàng đen',
      },
      {
        id: 'gold-phantom-side',
        src: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1200&q=80',
        alt: 'Gold Phantom React - góc nghiêng',
      },
      {
        id: 'gold-phantom-detail',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Gold Phantom React - chi tiết đế giày',
      },
      {
        id: 'gold-phantom-top',
        src: 'https://images.unsplash.com/photo-1549298916-c159a6c61c48?auto=format&fit=crop&w=1200&q=80',
        alt: 'Gold Phantom React - nhìn từ trên xuống',
      },
      {
        id: 'gold-phantom-lifestyle',
        src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Gold Phantom React - phong cách lifestyle',
      },
    ],
    specs: [
      { key: 'Chất liệu upper', value: 'Lưới kỹ thuật cao cấp' },
      { key: 'Đệm midsole', value: 'LUX React Foam' },
      { key: 'Trọng lượng', value: '260g (size 42)' },
      { key: 'Drop gót-mũi', value: '8mm' },
      { key: 'Loại chạy', value: 'Road / Daily Training' },
    ],
    category: 'running',
    isLimited: false,
    sizeStocks: [
      { id: 'gps-39', size: 'EU 39', stock: 5 },
      { id: 'gps-40', size: 'EU 40', stock: 10 },
      { id: 'gps-41', size: 'EU 41', stock: 0 },
      { id: 'gps-42', size: 'EU 42', stock: 7 },
      { id: 'gps-43', size: 'EU 43', stock: 3 },
    ],
  },
  {
    id: 'midnight-aurora-2',
    slug: 'midnight-aurora-2-0',
    name: 'Midnight Aurora 2.0',
    shortDescription: 'Phong cách đường phố với hiệu ứng phản quang độc đáo.',
    description:
      'Midnight Aurora 2.0 mang đến vibe đường phố năng động với upper phản quang và hệ thống dây buộc hiện đại. Đế ngoài ma sát cao giúp tự tin di chuyển trên nhiều bề mặt.',
    priceCurrent: 3_200_000,
    priceOriginal: 3_500_000,
    priceDiscount: 300_000,
    badge: 'HOT ITEM',
    ratingValue: 4.7,
    ratingCount: 96,
    isPublished: true,
    images: [
      {
        id: 'midnight-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Midnight Aurora 2.0 - phối màu midnight',
      },
      {
        id: 'midnight-street',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Midnight Aurora 2.0 - trên đường phố',
      },
      {
        id: 'midnight-detail',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
        alt: 'Midnight Aurora 2.0 - chi tiết chất liệu',
      },
      {
        id: 'midnight-top',
        src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Midnight Aurora 2.0 - góc nhìn trên cao',
      },
      {
        id: 'midnight-lifestyle',
        src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        alt: 'Midnight Aurora 2.0 - lifestyle phối đồ',
      },
    ],
    specs: [
      { key: 'Phong cách', value: 'Streetwear' },
      { key: 'Đế ngoài', value: 'Cao su chống trượt' },
      { key: 'Upper', value: 'Vải phản quang' },
    ],
    category: 'lifestyle',
    isLimited: false,
    sizeStocks: [
      { id: 'ma-39', size: 'EU 39', stock: 2 },
      { id: 'ma-40', size: 'EU 40', stock: 6 },
      { id: 'ma-41', size: 'EU 41', stock: 4 },
      { id: 'ma-42', size: 'EU 42', stock: 1 },
      { id: 'ma-43', size: 'EU 43', stock: 0 },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return MOCK_PRODUCTS.slice(0, 3);

  const sameCategory = MOCK_PRODUCTS.filter(
    (product) => product.slug !== slug && product.category === current.category
  );

  if (sameCategory.length >= 3) {
    return sameCategory.slice(0, 3);
  }

  const others = MOCK_PRODUCTS.filter(
    (product) => product.slug !== slug && product.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, 3);
}
