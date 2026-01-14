'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';

import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';
import { ordersApi } from '@/lib/api/orders.api';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

export default function OrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', 'paid'],
    queryFn: () => ordersApi.getOrders('PAID'),
  });

  const orders = data ?? [];
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders]
  );

  return (
    <>
      <LuxNavbar links={navLinks} />

      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <header className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold">
              ĐƠN HÀNG{' '}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                ĐÃ THANH TOÁN
              </span>
            </h1>
            <p className="text-gray-400">
              Xem lại các đơn hàng đã thanh toán của bạn.
            </p>
          </header>

          <section className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-amber-500/20 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm tracking-[0.3em] text-gray-500 uppercase">
                Tổng đơn hàng
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {orders.length}
              </p>
            </div>
            <div className="rounded-3xl border border-amber-500/20 bg-white/5 p-6 backdrop-blur-xl md:col-span-2">
              <p className="text-sm tracking-[0.3em] text-gray-500 uppercase">
                Tổng chi tiêu
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </section>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
                <p className="text-sm text-gray-400">
                  Đang tải danh sách đơn hàng...
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
              Không thể tải danh sách đơn hàng. Vui lòng thử lại.
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
              <h2 className="mb-3 text-2xl font-semibold text-white">
                Chưa có đơn hàng nào
              </h2>
              <p className="mb-6 text-gray-400">
                Khi bạn thanh toán xong, đơn hàng sẽ được lưu tại đây.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-amber-500/40 px-6 py-3 text-sm font-semibold tracking-[0.2em] text-amber-400 transition hover:border-amber-500 hover:text-amber-300"
              >
                XEM SẢN PHẨM
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm tracking-[0.3em] text-gray-500 uppercase">
                        {order.code}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Ngay thanh toan</p>
                      <p className="text-base font-semibold text-white">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Size {item.size} · x{item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-amber-400">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-sm tracking-[0.2em] text-gray-500 uppercase">
                        Trạng thái
                      </p>
                      <div className="mt-4 space-y-2 text-sm text-gray-300">
                        <p>
                          Order:{' '}
                          <span className="text-white">{order.status}</span>
                        </p>
                        <p>
                          Payment:{' '}
                          <span className="text-white">
                            {order.paymentStatus}
                          </span>
                        </p>
                        {order.paymentTransaction ? (
                          <p>
                            Transaction:{' '}
                            <span className="text-white">
                              {order.paymentTransaction.transactionCode}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
