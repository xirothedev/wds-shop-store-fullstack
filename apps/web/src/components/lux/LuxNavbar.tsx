'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getNumberOfCartItem } from '@/lib/api/cart.api';

import { Button } from './Button';
import SearchPopover from './SearchPopover';
import { type NavLink } from './types';

type LuxNavbarProps = {
  links: NavLink[];
};

export function LuxNavbar({ links }: LuxNavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartNumber, setCartNumber] = useState(0);

  useEffect(() => {
    getNumberOfCartItem().then((num) => setCartNumber(num));
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-amber-500/20 bg-white/5 px-6 py-3 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center text-2xl font-extrabold tracking-tighter outline-none"
          >
            <Image
              src="/logo-only.png"
              alt="LUX Sneakers"
              width={0}
              height={0}
              className="mr-2 h-7 w-7"
            />
            <span className="hidden text-white md:block">LUX</span>
            <span className="hidden bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent md:block">
              SNEAKERS
            </span>
            <span className="sr-only">Trang chủ</span>
          </Link>

          <div className="hidden space-x-8 font-medium md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="relative p-1.5"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="sr-only">Tìm kiếm</span>
              {/* Lucide search icon simplified to SVG path for now */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
            <a href="http://localhost:3000/cart">
              <Button variant="ghost" className="relative p-1.5">
                <span className="sr-only">Giỏ hàng</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {cartNumber > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 rounded-full bg-amber-500 px-1 text-[9px] leading-none font-bold text-black">
                    {cartNumber}
                  </span>
                ) : null}
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {isSearchOpen ? (
        <SearchPopover onClose={() => setIsSearchOpen(false)} />
      ) : null}
    </>
  );
}
