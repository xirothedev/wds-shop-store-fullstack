import type { NavLink, ProductCardProps, StatItem } from './types';

export const navLinks: NavLink[] = [
  { label: 'Bộ sưu tập', href: 'products' },
  { label: 'Nam', href: '/products?gender=MALE' },
  { label: 'Nữ', href: '/products?gender=FEMALE' },
  { label: 'Giảm giá', href: '/products?sale=true' },
  { label: 'Đơn hàng', href: '/orders' },
];

export const featuredProducts: ProductCardProps[] = [
  {
    icon: '👟',
    title: 'Gold Phantom React',
    subtitle: 'Dòng chạy bộ chuyên dụng',
    priceLabel: '4.500.000đ',
  },
  {
    icon: '🔥',
    title: 'Midnight Aurora 2.0',
    subtitle: 'Phong cách đường phố',
    priceLabel: '3.200.000đ',
    badge: { label: 'HOT ITEM', variant: 'hot' },
  },
  {
    icon: '✨',
    title: 'Carbon Fiber Elite',
    subtitle: 'Giới hạn 100 đôi',
    priceLabel: '8.900.000đ',
  },
  {
    icon: '⚡',
    title: 'Thunder Strike Gold',
    subtitle: 'Bộ sưu tập mùa hè',
    priceLabel: '5.100.000đ',
    badge: { label: 'NEW', variant: 'new' },
  },
  {
    icon: '👑',
    title: 'Royal Court Low',
    subtitle: 'Phiên bản Casual',
    priceLabel: '2.800.000đ',
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
