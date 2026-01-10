export interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductSizeStock {
  id: string;
  size: string;
  stock: number;
}

export interface ProductSpecItem {
  key: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Product {
  // Prisma Product fields (apps/api/prisma/schema.prisma)
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCurrent: number;
  priceOriginal?: number;
  priceDiscount?: number;
  badge?: string;
  ratingValue: number;
  ratingCount: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sizeStocks?: ProductSizeStock[]; // Flatten quan hệ ProductSizeStock cho FE

  // Product gender
  gender?: 'MALE' | 'FEMALE' | 'UNISEX';

  // UI-only fields (không có trong schema, chỉ dùng render FE)
  shortDescription?: string;
  images?: ProductImage[];
  specs?: ProductSpecItem[];
  category?: string;
  isLimited?: boolean;
}

export interface CartItem extends Product {
  cartItemId: string;
  size: string;
  quantity: number;
  stock: number;
}
