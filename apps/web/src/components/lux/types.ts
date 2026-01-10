import { ProductImage } from "@/types/product";

export type NavLink = {
  label: string;
  href: string;
};

export type ProductBadgeVariant = 'hot' | 'new' | 'default';

export type ProductBadge = {
  label: string;
  variant?: ProductBadgeVariant;
};

export type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  priceCurrent: number;
  badge?: string | ProductBadge;
  images: ProductImage[];
  ratingCount?: number;
  ratingValue?: number;
};

export type StatItem = {
  value: string;
  label: string;
};
