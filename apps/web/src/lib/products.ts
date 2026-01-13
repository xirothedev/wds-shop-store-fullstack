import type { Product, ProductImage } from '@/types/product';

import {
  getFeaturedProducts as getFeaturedProductsApi,
  getProductBySlug as getProductBySlugApi,
  getProducts,
  getRelatedProducts as getRelatedProductsApi,
} from './api/products.api';

/**
 * Transform API product to frontend Product format
 * - Convert images from string[] to ProductImage[]
 * - Ensure all required fields are present
 */
function transformProductFromApi(apiProduct: any): Product {
  const images: ProductImage[] =
    apiProduct.images && Array.isArray(apiProduct.images)
      ? apiProduct.images.map((url: string, index: number) => ({
          id: `img-${index}`,
          src: url,
          alt: apiProduct.name || 'Product image',
        }))
      : [];

  // Transform sizeStocks from Prisma format to frontend format
  const sizeStocks =
    apiProduct.sizeStocks && Array.isArray(apiProduct.sizeStocks)
      ? apiProduct.sizeStocks.map((stock: any) => ({
          id: stock.id || `size-${stock.size}`,
          size: stock.size,
          stock: stock.stock || 0,
        }))
      : undefined;

  return {
    ...apiProduct,
    images,
    sizeStocks,
    ratingValue: apiProduct.ratingValue ? Number(apiProduct.ratingValue) : 0,
    ratingCount: apiProduct.ratingCount ? Number(apiProduct.ratingCount) : 0,
    priceCurrent: Number(apiProduct.priceCurrent) || 0,
    priceOriginal: apiProduct.priceOriginal
      ? Number(apiProduct.priceOriginal)
      : undefined,
    priceDiscount: apiProduct.priceDiscount
      ? Number(apiProduct.priceDiscount)
      : undefined,
  };
}

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
    gender: 'UNISEX',
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
    gender: 'FEMALE',
    isLimited: false,
    sizeStocks: [
      { id: 'ma-39', size: 'EU 39', stock: 2 },
      { id: 'ma-40', size: 'EU 40', stock: 6 },
      { id: 'ma-41', size: 'EU 41', stock: 4 },
      { id: 'ma-42', size: 'EU 42', stock: 1 },
      { id: 'ma-43', size: 'EU 43', stock: 0 },
    ],
  },
  {
    id: 'speed-blaze-pro',
    slug: 'speed-blaze-pro',
    name: 'Speed Blaze Pro',
    shortDescription: 'Giày chạy tốc độ với công nghệ carbon plate.',
    description:
      'Speed Blaze Pro được thiết kế cho các runner chuyên nghiệp với carbon plate tích hợp, giúp tăng hiệu suất và tốc độ. Upper siêu nhẹ và đệm phản hồi năng lượng tối đa.',
    priceCurrent: 5_200_000,
    priceOriginal: 5_800_000,
    priceDiscount: 600_000,
    badge: 'NEW',
    ratingValue: 4.9,
    ratingCount: 245,
    isPublished: true,
    images: [
      {
        id: 'speed-blaze-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Speed Blaze Pro - phối màu đỏ đen',
      },
    ],
    specs: [
      { key: 'Carbon Plate', value: 'Có' },
      { key: 'Trọng lượng', value: '220g (size 42)' },
      { key: 'Loại chạy', value: 'Racing / Speed Training' },
    ],
    category: 'running',
    gender: 'MALE',
    isLimited: true,
    sizeStocks: [
      { id: 'sbp-39', size: 'EU 39', stock: 3 },
      { id: 'sbp-40', size: 'EU 40', stock: 5 },
      { id: 'sbp-41', size: 'EU 41', stock: 2 },
      { id: 'sbp-42', size: 'EU 42', stock: 4 },
      { id: 'sbp-43', size: 'EU 43', stock: 1 },
    ],
  },
  {
    id: 'urban-street-x',
    slug: 'urban-street-x',
    name: 'Urban Street X',
    shortDescription: 'Phong cách streetwear hiện đại với chất liệu cao cấp.',
    description:
      'Urban Street X kết hợp giữa phong cách đường phố và sự thoải mái. Upper da tổng hợp bền bỉ, đế ngoài chống trượt và thiết kế đa năng phù hợp mọi dịp.',
    priceCurrent: 2_800_000,
    priceOriginal: 3_200_000,
    priceDiscount: 400_000,
    badge: 'BEST SELLER',
    ratingValue: 4.6,
    ratingCount: 189,
    isPublished: true,
    images: [
      {
        id: 'urban-main',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Urban Street X - phong cách streetwear',
      },
    ],
    specs: [
      { key: 'Chất liệu', value: 'Da tổng hợp cao cấp' },
      { key: 'Phong cách', value: 'Streetwear / Casual' },
    ],
    category: 'lifestyle',
    gender: 'UNISEX',
    isLimited: false,
    sizeStocks: [
      { id: 'usx-39', size: 'EU 39', stock: 8 },
      { id: 'usx-40', size: 'EU 40', stock: 12 },
      { id: 'usx-41', size: 'EU 41', stock: 10 },
      { id: 'usx-42', size: 'EU 42', stock: 15 },
      { id: 'usx-43', size: 'EU 43', stock: 7 },
    ],
  },
  {
    id: 'trail-master-ultra',
    slug: 'trail-master-ultra',
    name: 'Trail Master Ultra',
    shortDescription: 'Giày chạy trail với độ bám đường vượt trội.',
    description:
      'Trail Master Ultra được thiết kế cho các runner địa hình với outsole lugs sâu, bảo vệ chống đá và độ bền cao. Upper chống nước và thoáng khí.',
    priceCurrent: 4_800_000,
    priceOriginal: 5_200_000,
    priceDiscount: 400_000,
    badge: 'HOT ITEM',
    ratingValue: 4.7,
    ratingCount: 156,
    isPublished: true,
    images: [
      {
        id: 'trail-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Trail Master Ultra - giày trail',
      },
    ],
    specs: [
      { key: 'Outsole', value: 'Lugs sâu 5mm' },
      { key: 'Chống nước', value: 'Có' },
      { key: 'Loại chạy', value: 'Trail / Off-road' },
    ],
    category: 'running',
    gender: 'MALE',
    isLimited: false,
    sizeStocks: [
      { id: 'tmu-39', size: 'EU 39', stock: 4 },
      { id: 'tmu-40', size: 'EU 40', stock: 6 },
      { id: 'tmu-41', size: 'EU 41', stock: 3 },
      { id: 'tmu-42', size: 'EU 42', stock: 5 },
      { id: 'tmu-43', size: 'EU 43', stock: 2 },
    ],
  },
  {
    id: 'classic-retro-90',
    slug: 'classic-retro-90',
    name: 'Classic Retro 90',
    shortDescription: 'Phong cách retro những năm 90 với thiết kế cổ điển.',
    description:
      'Classic Retro 90 mang đến cảm giác hoài niệm với thiết kế cổ điển từ thập niên 90. Chất liệu cao cấp và màu sắc đặc trưng thời đại.',
    priceCurrent: 3_500_000,
    priceOriginal: 3_900_000,
    priceDiscount: 400_000,
    badge: 'NEW',
    ratingValue: 4.5,
    ratingCount: 203,
    isPublished: true,
    images: [
      {
        id: 'retro-main',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Classic Retro 90 - phong cách retro',
      },
    ],
    specs: [
      { key: 'Phong cách', value: 'Retro / Vintage' },
      { key: 'Năm thiết kế', value: '1990s inspired' },
    ],
    category: 'lifestyle',
    gender: 'UNISEX',
    isLimited: false,
    sizeStocks: [
      { id: 'cr90-39', size: 'EU 39', stock: 6 },
      { id: 'cr90-40', size: 'EU 40', stock: 9 },
      { id: 'cr90-41', size: 'EU 41', stock: 7 },
      { id: 'cr90-42', size: 'EU 42', stock: 11 },
      { id: 'cr90-43', size: 'EU 43', stock: 5 },
    ],
  },
  {
    id: 'marathon-elite',
    slug: 'marathon-elite',
    name: 'Marathon Elite',
    shortDescription: 'Giày marathon chuyên nghiệp với công nghệ tiên tiến.',
    description:
      'Marathon Elite được phát triển cùng các vận động viên marathon chuyên nghiệp. Đệm phản hồi cao cấp, độ bền vượt trội và trọng lượng siêu nhẹ.',
    priceCurrent: 5_500_000,
    priceOriginal: 6_000_000,
    priceDiscount: 500_000,
    badge: 'BEST SELLER',
    ratingValue: 4.9,
    ratingCount: 312,
    isPublished: true,
    images: [
      {
        id: 'marathon-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Marathon Elite - giày marathon',
      },
    ],
    specs: [
      { key: 'Trọng lượng', value: '210g (size 42)' },
      { key: 'Đệm', value: 'LUX Elite Foam' },
      { key: 'Loại chạy', value: 'Marathon / Long Distance' },
    ],
    category: 'running',
    gender: 'MALE',
    isLimited: false,
    sizeStocks: [
      { id: 'me-39', size: 'EU 39', stock: 2 },
      { id: 'me-40', size: 'EU 40', stock: 4 },
      { id: 'me-41', size: 'EU 41', stock: 3 },
      { id: 'me-42', size: 'EU 42', stock: 5 },
      { id: 'me-43', size: 'EU 43', stock: 1 },
    ],
  },
  {
    id: 'sneaker-luxury-pro',
    slug: 'sneaker-luxury-pro',
    name: 'Sneaker Luxury Pro',
    shortDescription: 'Sneaker cao cấp với chất liệu da thật.',
    description:
      'Sneaker Luxury Pro được làm từ da thật cao cấp, thiết kế tinh tế và sang trọng. Phù hợp cho các dịp quan trọng và phong cách business casual.',
    priceCurrent: 6_200_000,
    priceOriginal: 6_800_000,
    priceDiscount: 600_000,
    badge: 'HOT ITEM',
    ratingValue: 4.8,
    ratingCount: 178,
    isPublished: true,
    images: [
      {
        id: 'luxury-main',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Sneaker Luxury Pro - giày cao cấp',
      },
    ],
    specs: [
      { key: 'Chất liệu', value: 'Da thật cao cấp' },
      { key: 'Phong cách', value: 'Luxury / Business Casual' },
    ],
    category: 'lifestyle',
    gender: 'MALE',
    isLimited: true,
    sizeStocks: [
      { id: 'slp-39', size: 'EU 39', stock: 1 },
      { id: 'slp-40', size: 'EU 40', stock: 3 },
      { id: 'slp-41', size: 'EU 41', stock: 2 },
      { id: 'slp-42', size: 'EU 42', stock: 4 },
      { id: 'slp-43', size: 'EU 43', stock: 1 },
    ],
  },
  {
    id: 'daily-comfort-max',
    slug: 'daily-comfort-max',
    name: 'Daily Comfort Max',
    shortDescription: 'Giày đi bộ hàng ngày với độ êm ái tối đa.',
    description:
      'Daily Comfort Max được thiết kế cho những người đi bộ hàng ngày với đệm êm ái, hỗ trợ bàn chân tốt và độ bền cao. Phù hợp cho mọi lứa tuổi.',
    priceCurrent: 2_500_000,
    priceOriginal: 2_900_000,
    priceDiscount: 400_000,
    ratingValue: 4.4,
    ratingCount: 267,
    isPublished: true,
    images: [
      {
        id: 'comfort-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Daily Comfort Max - giày đi bộ',
      },
    ],
    specs: [
      { key: 'Đệm', value: 'Comfort Max Foam' },
      { key: 'Loại sử dụng', value: 'Walking / Daily Use' },
    ],
    category: 'lifestyle',
    gender: 'UNISEX',
    isLimited: false,
    sizeStocks: [
      { id: 'dcm-39', size: 'EU 39', stock: 10 },
      { id: 'dcm-40', size: 'EU 40', stock: 15 },
      { id: 'dcm-41', size: 'EU 41', stock: 12 },
      { id: 'dcm-42', size: 'EU 42', stock: 18 },
      { id: 'dcm-43', size: 'EU 43', stock: 9 },
    ],
  },
  {
    id: 'track-spike-pro',
    slug: 'track-spike-pro',
    name: 'Track Spike Pro',
    shortDescription: 'Giày chạy track với spike tích hợp.',
    description:
      'Track Spike Pro được thiết kế cho các vận động viên chạy track với spike tích hợp, độ bám đường tốt và trọng lượng siêu nhẹ.',
    priceCurrent: 4_200_000,
    priceOriginal: 4_600_000,
    priceDiscount: 400_000,
    badge: 'NEW',
    ratingValue: 4.6,
    ratingCount: 134,
    isPublished: true,
    images: [
      {
        id: 'track-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Track Spike Pro - giày track',
      },
    ],
    specs: [
      { key: 'Spike', value: 'Tích hợp' },
      { key: 'Trọng lượng', value: '180g (size 42)' },
      { key: 'Loại chạy', value: 'Track / Sprint' },
    ],
    category: 'running',
    gender: 'MALE',
    isLimited: false,
    sizeStocks: [
      { id: 'tsp-39', size: 'EU 39', stock: 3 },
      { id: 'tsp-40', size: 'EU 40', stock: 5 },
      { id: 'tsp-41', size: 'EU 41', stock: 2 },
      { id: 'tsp-42', size: 'EU 42', stock: 4 },
      { id: 'tsp-43', size: 'EU 43', stock: 2 },
    ],
  },
  {
    id: 'casual-walker',
    slug: 'casual-walker',
    name: 'Casual Walker',
    shortDescription: 'Giày casual đa năng cho mọi dịp.',
    description:
      'Casual Walker là lựa chọn hoàn hảo cho phong cách casual hàng ngày. Thiết kế đơn giản, thoải mái và dễ phối đồ.',
    priceCurrent: 2_200_000,
    priceOriginal: 2_500_000,
    priceDiscount: 300_000,
    ratingValue: 4.3,
    ratingCount: 198,
    isPublished: true,
    images: [
      {
        id: 'casual-main',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Casual Walker - giày casual',
      },
    ],
    specs: [
      { key: 'Phong cách', value: 'Casual / Everyday' },
      { key: 'Đa năng', value: 'Có' },
    ],
    category: 'lifestyle',
    gender: 'FEMALE',
    isLimited: false,
    sizeStocks: [
      { id: 'cw-39', size: 'EU 39', stock: 7 },
      { id: 'cw-40', size: 'EU 40', stock: 11 },
      { id: 'cw-41', size: 'EU 41', stock: 9 },
      { id: 'cw-42', size: 'EU 42', stock: 13 },
      { id: 'cw-43', size: 'EU 43', stock: 6 },
    ],
  },
  {
    id: 'ultra-light-speed',
    slug: 'ultra-light-speed',
    name: 'Ultra Light Speed',
    shortDescription: 'Giày chạy siêu nhẹ với công nghệ mới nhất.',
    description:
      'Ultra Light Speed là đỉnh cao của công nghệ giày chạy với trọng lượng chỉ 190g. Đệm phản hồi năng lượng và độ bền vượt trội.',
    priceCurrent: 5_800_000,
    priceOriginal: 6_300_000,
    priceDiscount: 500_000,
    badge: 'HOT ITEM',
    ratingValue: 4.9,
    ratingCount: 289,
    isPublished: true,
    images: [
      {
        id: 'ultra-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Ultra Light Speed - giày siêu nhẹ',
      },
    ],
    specs: [
      { key: 'Trọng lượng', value: '190g (size 42)' },
      { key: 'Công nghệ', value: 'Ultra Light Foam' },
      { key: 'Loại chạy', value: 'Racing / Speed' },
    ],
    category: 'running',
    gender: 'MALE',
    isLimited: true,
    sizeStocks: [
      { id: 'uls-39', size: 'EU 39', stock: 2 },
      { id: 'uls-40', size: 'EU 40', stock: 3 },
      { id: 'uls-41', size: 'EU 41', stock: 1 },
      { id: 'uls-42', size: 'EU 42', stock: 4 },
      { id: 'uls-43', size: 'EU 43', stock: 1 },
    ],
  },
  {
    id: 'sport-casual-mix',
    slug: 'sport-casual-mix',
    name: 'Sport Casual Mix',
    shortDescription: 'Kết hợp giữa thể thao và casual.',
    description:
      'Sport Casual Mix là sự kết hợp hoàn hảo giữa tính năng thể thao và phong cách casual. Phù hợp cho cả tập luyện và sinh hoạt hàng ngày.',
    priceCurrent: 3_000_000,
    priceOriginal: 3_400_000,
    priceDiscount: 400_000,
    ratingValue: 4.5,
    ratingCount: 221,
    isPublished: true,
    images: [
      {
        id: 'sport-casual-main',
        src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
        alt: 'Sport Casual Mix - giày thể thao casual',
      },
    ],
    specs: [
      { key: 'Phong cách', value: 'Sport Casual' },
      { key: 'Đa năng', value: 'Tập luyện & Casual' },
    ],
    category: 'lifestyle',
    gender: 'FEMALE',
    isLimited: false,
    sizeStocks: [
      { id: 'scm-39', size: 'EU 39', stock: 8 },
      { id: 'scm-40', size: 'EU 40', stock: 12 },
      { id: 'scm-41', size: 'EU 41', stock: 10 },
      { id: 'scm-42', size: 'EU 42', stock: 14 },
      { id: 'scm-43', size: 'EU 43', stock: 7 },
    ],
  },
  {
    id: 'endurance-plus',
    slug: 'endurance-plus',
    name: 'Endurance Plus',
    shortDescription: 'Giày chạy bền với độ bền vượt trội.',
    description:
      'Endurance Plus được thiết kế cho các runner chạy đường dài với độ bền cao, đệm êm ái và hỗ trợ tốt cho bàn chân trong thời gian dài.',
    priceCurrent: 4_600_000,
    priceOriginal: 5_000_000,
    priceDiscount: 400_000,
    badge: 'BEST SELLER',
    ratingValue: 4.7,
    ratingCount: 256,
    isPublished: true,
    images: [
      {
        id: 'endurance-main',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Endurance Plus - giày chạy bền',
      },
    ],
    specs: [
      { key: 'Độ bền', value: '1000+ km' },
      { key: 'Loại chạy', value: 'Long Distance / Endurance' },
    ],
    category: 'running',
    gender: 'UNISEX',
    isLimited: false,
    sizeStocks: [
      { id: 'ep-39', size: 'EU 39', stock: 5 },
      { id: 'ep-40', size: 'EU 40', stock: 7 },
      { id: 'ep-41', size: 'EU 41', stock: 4 },
      { id: 'ep-42', size: 'EU 42', stock: 6 },
      { id: 'ep-43', size: 'EU 43', stock: 3 },
    ],
  },
];

export async function getAllProducts(
  page: number = 1,
  limit: number = 12,
  filters?: {
    gender?: 'MALE' | 'FEMALE' | 'UNISEX';
    sale?: boolean;
    search?: string;
    sortBy?: string,
    sortValue?: string,
    orderBy?: string,
  }
): Promise<{ products: Product[]; hasMore: boolean }> {
  try {
    const MOCK_PRODUCTS = await getProducts(
      filters?.gender,
      filters?.sale ? 'true' : 'false',
      filters?.search,
      filters?.sortBy,
      filters?.sortValue,
      filters?.orderBy
    );

    // Ensure we have an array
    if (!Array.isArray(MOCK_PRODUCTS)) {
      console.error('getProducts did not return an array:', MOCK_PRODUCTS);
      return { products: [], hasMore: false };
    }

    const filteredProducts = MOCK_PRODUCTS.filter(
      (product) => product.isPublished !== false
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredProducts.length;

    return { products, hasMore };
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return { products: [], hasMore: false };
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  try {
    const apiProduct = await getProductBySlugApi(slug);
    if (!apiProduct) {
      return undefined;
    }
    return transformProductFromApi(apiProduct);
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return undefined;
  }
}
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    // Note: API doesn't have getProductById endpoint, using getProducts and filtering
    // If API adds this endpoint later, update this function
    const products = await getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      return undefined;
    }
    return product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return undefined;
  }
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const related = await getRelatedProductsApi(slug);
    if (!related || !Array.isArray(related)) {
      return [];
    }
    return related.map(transformProductFromApi);
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
}
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const featured = await getFeaturedProductsApi();
    if (!featured || !Array.isArray(featured)) {
      return [];
    }
    return featured.map(transformProductFromApi);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

// CRUD Functions for Admin Panel

export function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Product {
  // Generate ID and slug if not provided
  const id = productData.slug || `product-${Date.now()}`;
  const slug =
    productData.slug ||
    productData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  // Check if slug already exists
  if (MOCK_PRODUCTS.some((p) => p.slug === slug)) {
    throw new Error(`Product with slug "${slug}" already exists`);
  }

  // Calculate discount if both prices are provided
  const priceDiscount =
    productData.priceOriginal &&
    productData.priceOriginal > productData.priceCurrent
      ? productData.priceOriginal - productData.priceCurrent
      : undefined;

  const newProduct: Product = {
    ...productData,
    id,
    slug,
    priceDiscount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_PRODUCTS.push(newProduct);
  return newProduct;
}

export function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Product {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Product with id "${id}" not found`);
  }

  const existingProduct = MOCK_PRODUCTS[index];

  // Check slug uniqueness if slug is being updated
  if (productData.slug && productData.slug !== existingProduct.slug) {
    if (MOCK_PRODUCTS.some((p) => p.slug === productData.slug && p.id !== id)) {
      throw new Error(`Product with slug "${productData.slug}" already exists`);
    }
  }

  // Calculate discount if prices are updated
  let priceDiscount = existingProduct.priceDiscount;
  const priceCurrent = productData.priceCurrent ?? existingProduct.priceCurrent;
  const priceOriginal =
    productData.priceOriginal ?? existingProduct.priceOriginal;

  if (priceOriginal && priceOriginal > priceCurrent) {
    priceDiscount = priceOriginal - priceCurrent;
  } else {
    priceDiscount = undefined;
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...productData,
    priceDiscount,
    updatedAt: new Date().toISOString(),
  };

  MOCK_PRODUCTS[index] = updatedProduct;
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Product with id "${id}" not found`);
  }

  MOCK_PRODUCTS.splice(index, 1);
  return true;
}

export function getAllProductsForAdmin(): Product[] {
  return [...MOCK_PRODUCTS];
}
