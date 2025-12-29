'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';

export function AuthLoginForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="px-20">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold">Đăng nhập</h2>
        <p className="text-sm text-gray-400">
          Đăng nhập để tiếp tục mua sắm và theo dõi các ưu đãi dành riêng cho
          bạn.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Email
          </label>
          <input
            type="email"
            className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)]"
            placeholder="example@email.com"
            data-lux-hover
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Mật khẩu
          </label>
          <input
            type="password"
            className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)]"
            placeholder="••••••••"
            data-lux-hover
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded accent-amber-500"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-xs text-gray-400 select-none"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          <Link
            href="#"
            className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase transition-colors hover:text-amber-400"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-4 w-full transform rounded-xl bg-linear-to-br from-amber-400 to-amber-600 py-3.5 text-sm font-bold text-black shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          data-lux-hover
        >
          ĐĂNG NHẬP
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-gray-500">
        Chưa có tài khoản?{' '}
        <Link
          href="/auth/register"
          className="font-semibold text-amber-400 underline-offset-2 hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </main>
  );
}
