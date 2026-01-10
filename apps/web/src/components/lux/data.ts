import type { NavLink, ProductCardProps, StatItem } from './types';

export const navLinks: NavLink[] = [
  { label: 'Bộ sưu tập', href: 'products' },
  { label: 'Nam', href: '/products?gender=MALE' },
  { label: 'Nữ', href: '/products?gender=FEMALE' },
  { label: 'Giảm giá', href: '/products?sale=true' },
];

export const featuredProducts: ProductCardProps[] = [
  {
    id: '1',
    slug: 'gold-phantom-react',
    name: 'Gold Phantom React',
    priceCurrent: 4500000,
    badge: 'New Arrival',
    images: [{ id: '1', src: '/placeholder.png', alt: 'Gold Phantom React' }],
    ratingValue: 4.8,
    ratingCount: 125,
  },
  {
    id: '2',
    slug: 'midnight-aurora-20',
    name: 'Midnight Aurora 2.0',
    priceCurrent: 3200000,
    badge: 'HOT ITEM',
    images: [{ id: '2', src: '/placeholder.png', alt: 'Midnight Aurora 2.0' }],
    ratingValue: 4.9,
    ratingCount: 89,
  },
  {
    id: '3',
    slug: 'carbon-fiber-elite',
    name: 'Carbon Fiber Elite',
    priceCurrent: 8900000,
    badge: 'Limited',
    images: [{ id: '3', src: '/placeholder.png', alt: 'Carbon Fiber Elite' }],
    ratingValue: 5.0,
    ratingCount: 42,
  },
  {
    id: '4',
    slug: 'thunder-strike-gold',
    name: 'Thunder Strike Gold',
    priceCurrent: 5100000,
    badge: 'NEW',
    images: [{ id: '4', src: '/placeholder.png', alt: 'Thunder Strike Gold' }],
    ratingValue: 4.7,
    ratingCount: 156,
  },
  {
    id: '5',
    slug: 'royal-court-low',
    name: 'Royal Court Low',
    priceCurrent: 2800000,
    images: [{ id: '5', src: '/placeholder.png', alt: 'Royal Court Low' }],
    ratingValue: 4.6,
    ratingCount: 201,
  },
];

export const statsItems: StatItem[] = [
  { value: '150K+', label: 'Khách hàng' },
  { value: '50+', label: 'Cửa hàng' },
  { value: '200+', label: 'Mẫu thiết kế' },
  { value: '4.9/5', label: 'Đánh giá' },
];

export const footerLinks: NavLink[] = [
  { label: 'Về chúng tôi', href: '#' },
  { label: 'Chính sách bảo mật', href: '#' },
  { label: 'Điều khoản dịch vụ', href: '#' },
];

export const footerSocials: NavLink[] = [
  { label: 'FB', href: '#' },
  { label: 'IG', href: '#' },
  { label: 'TT', href: '#' },
];
