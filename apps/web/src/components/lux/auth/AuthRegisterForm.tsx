'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';

export function AuthRegisterForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="px-20">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold">Tạo tài khoản</h2>
        <p className="text-sm text-gray-400">
          Đăng ký tài khoản để trải nghiệm những sản phẩm độc quyền và nhận ưu
          đãi độc quyền.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Họ
            </label>
            <input
              type="text"
              className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)]"
              placeholder="Nguyễn"
              data-lux-hover
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Tên
            </label>
            <input
              type="text"
              className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)]"
              placeholder="An"
              data-lux-hover
            />
          </div>
        </div>

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
              id="terms"
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded accent-amber-500"
            />
            <label
              htmlFor="terms"
              className="cursor-pointer text-xs text-gray-400 select-none"
            >
              Tôi đồng ý với{' '}
              <Link
                href="/terms"
                className="text-amber-500 underline-offset-2 hover:underline"
              >
                Điều khoản
              </Link>{' '}
              &amp;{' '}
              <Link
                href="/privacy"
                className="text-amber-500 underline-offset-2 hover:underline"
              >
                Chính sách
              </Link>
            </label>
          </div>

          <Link
            href="/auth/login"
            className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase transition-colors hover:text-amber-400"
          >
            Đã có tài khoản?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-4 w-full transform rounded-xl bg-linear-to-br from-amber-400 to-amber-600 py-3.5 text-sm font-bold text-black shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          data-lux-hover
        >
          ĐĂNG KÝ NGAY
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-gray-500">
        Bằng việc đăng ký, bạn đồng ý nhận email marketing từ LUX Sneakers.
      </div>
    </main>
  );
}
