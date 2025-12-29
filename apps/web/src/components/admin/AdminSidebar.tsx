'use client';

import { Home, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const adminMenuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: Package,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-background fixed top-0 left-0 z-40 h-screen w-64 border-r border-amber-500/20">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-amber-500/20 px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">LUX</span>
            <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-xl font-bold text-transparent">
              ADMIN
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-amber-400'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-amber-500/20 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </aside>
  );
}
