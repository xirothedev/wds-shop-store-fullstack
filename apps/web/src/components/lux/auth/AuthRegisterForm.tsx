'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { getErrorMessage, useRegister } from '@/lib/hooks/useAuth';

import { Button } from '../Button';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

export function AuthRegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setSuccess(false);

    try {
      // Combine firstName and lastName into fullName
      const fullName =
        `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        fullName,
      });

      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err as Parameters<typeof getErrorMessage>[0]));
    }
  };

  if (success) {
    return (
      <main className="px-20">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Đăng ký thành công!</h2>
          <p className="text-sm text-gray-400">
            Vui lòng kiểm tra email để xác thực tài khoản của bạn.
          </p>
        </div>
        <div className="rounded-xl border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Chúng tôi đã gửi email xác thực đến địa chỉ email của bạn. Vui lòng
          kiểm tra hộp thư và làm theo hướng dẫn để kích hoạt tài khoản.
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          <Link
            href="/auth/login"
            className="font-semibold text-amber-400 underline-offset-2 hover:underline"
          >
            Quay lại trang đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-20">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold">Tạo tài khoản</h2>
        <p className="text-sm text-gray-400">
          Đăng ký tài khoản để trải nghiệm những sản phẩm độc quyền và nhận ưu
          đãi độc quyền.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Họ
            </label>
            <input
              type="text"
              {...register('firstName', {
                required: 'Họ là bắt buộc',
              })}
              disabled={isSubmitting || registerMutation.isPending}
              className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nguyễn"
              data-lux-hover
            />
            {errors.firstName && (
              <p className="text-xs text-red-400">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Tên
            </label>
            <input
              type="text"
              {...register('lastName', {
                required: 'Tên là bắt buộc',
              })}
              disabled={isSubmitting || registerMutation.isPending}
              className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="An"
              data-lux-hover
            />
            {errors.lastName && (
              <p className="text-xs text-red-400">{errors.lastName.message}</p>
            )}
          </div>
        </div>

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
            disabled={isSubmitting || registerMutation.isPending}
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
              minLength: {
                value: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự',
              },
            })}
            disabled={isSubmitting || registerMutation.isPending}
            className="text-foreground w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all outline-none placeholder:text-gray-500 focus:border-amber-500 focus:bg-white/5 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="••••••••"
            data-lux-hover
          />
          {errors.password ? (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          ) : (
            <p className="text-[10px] text-gray-500">
              Mật khẩu phải có ít nhất 8 ký tự
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              {...register('acceptedTerms', {
                required: 'Vui lòng đồng ý với điều khoản và chính sách',
              })}
              disabled={isSubmitting || registerMutation.isPending}
              className="h-4 w-4 cursor-pointer rounded accent-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          {errors.acceptedTerms && (
            <p className="text-xs text-red-400">
              {errors.acceptedTerms.message}
            </p>
          )}

          <Link
            href="/auth/login"
            className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase transition-colors hover:text-amber-400"
          >
            Đã có tài khoản?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="mt-4 w-full"
          data-lux-hover
          disabled={isSubmitting || registerMutation.isPending}
        >
          {isSubmitting || registerMutation.isPending
            ? 'ĐANG ĐĂNG KÝ...'
            : 'ĐĂNG KÝ NGAY'}
        </Button>
      </form>

      <div className="mt-8 text-center text-xs text-gray-500">
        Bằng việc đăng ký, bạn đồng ý nhận email marketing từ LUX Sneakers.
      </div>
    </main>
  );
}
