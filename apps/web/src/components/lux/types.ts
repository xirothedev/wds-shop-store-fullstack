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
  icon: React.ReactNode;
  title: string;
  slug: string;
  subtitle?: string;
  priceLabel: string;
  badge?: ProductBadge;
  img?: string;
};

export type StatItem = {
  value: string;
  label: string;
};
