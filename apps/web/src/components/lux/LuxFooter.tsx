import Link from 'next/link';

import type { NavLink } from './types';

type LuxFooterProps = {
  links: NavLink[];
  socials: NavLink[];
};

export function LuxFooter({ links, socials }: LuxFooterProps) {
  return (
    <footer className="border-t border-white/5 px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="col-span-1 space-y-6 md:col-span-2">
          <div className="text-3xl font-extrabold tracking-tighter">
            <span className="text-white">LUX</span>
            <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              SNEAKERS
            </span>
          </div>
          <p className="max-w-sm text-gray-500">
            Đăng ký nhận thông báo về các sản phẩm giới hạn và ưu đãi độc quyền
            dành riêng cho bạn.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-6 py-3 outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-linear-to-br from-amber-400 to-amber-600 px-6 py-3 font-bold text-black"
            >
              GỬI
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-bold">Liên kết</h4>
          <ul className="space-y-2 text-gray-500">
            {links.map((link, index) => (
              <li key={`${link.href}-${index}`}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-amber-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-bold">Theo dõi</h4>
          <div className="flex space-x-4">
            {socials.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 transition-all hover:bg-amber-500 hover:text-black"
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl border-t border-white/5 pt-8 text-center text-sm text-gray-600">
        © 2025 LUX SNEAKERS. All rights reserved. Designed for WebDev Studios.
      </div>
    </footer>
  );
}
