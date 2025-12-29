import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';

export default function ProductsLoading() {
  return (
    <>
      <LuxNavbar links={navLinks} cartCount={3} />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold">
              TẤT CẢ{' '}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                SẢN PHẨM
              </span>
            </h1>
            <p className="text-gray-400">Đang tải...</p>
          </div>
        </div>
      </main>
    </>
  );
}
