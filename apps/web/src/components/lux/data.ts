import type { NavLink, StatItem } from './types';

export const navLinks: NavLink[] = [
  { label: 'Bộ sưu tập', href: 'products' },
  { label: 'Nam', href: '/products?gender=MALE' },
  { label: 'Nữ', href: '/products?gender=FEMALE' },
  { label: 'Giảm giá', href: '/products?sale=true' },
  { label: 'Đơn hàng', href: '/orders' },
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
