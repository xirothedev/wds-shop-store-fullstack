'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { getErrorMessage, useLogin } from '@/lib/hooks/useAuth';

import { Button } from '../Button';

interface LoginFormData {
  email: string;
  password: string;
}

export function AuthLoginForm() {
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await loginMutation.mutateAsync(data);
    } catch (err) {
      setError(getErrorMessage(err as Parameters<typeof getErrorMessage>[0]));
    }
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

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email là bắt buộc',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email không hợp lệ',
              },
            })}
            disabled={isSubmitting || loginMutation.isPending}
            className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="example@email.com"
            data-lux-hover
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Mật khẩu
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Mật khẩu là bắt buộc',
            })}
            disabled={isSubmitting || loginMutation.isPending}
            className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
            data-lux-hover
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
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

        <Button
          type="submit"
          variant="primary"
          className="mt-4 w-full"
          data-lux-hover
          disabled={isSubmitting || loginMutation.isPending}
        >
          {isSubmitting || loginMutation.isPending
            ? 'ĐANG ĐĂNG NHẬP...'
            : 'ĐĂNG NHẬP'}
        </Button>
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
