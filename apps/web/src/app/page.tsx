import type { Metadata } from 'next';

import { navLinks, statsItems } from '@/components/lux/data';
import { HeroSection } from '@/components/lux/HeroSection';
import { HeroVisual } from '@/components/lux/HeroVisual';
import { LuxNavbar } from '@/components/lux/LuxNavbar';
import { ProductSliderSection } from '@/components/lux/ProductSliderSection';
import { RevealOnScroll } from '@/components/lux/RevealOnScroll';
import { StatsBar } from '@/components/lux/StatsBar';
import { getFeaturedProducts } from '@/lib/products';

import ProductsContent from './products/page';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description:
    'Khám phá bộ sưu tập giày thể thao cao cấp LUX Sneakers. Sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng đẳng cấp quốc tế.',
  openGraph: {
    title: 'LUX Sneakers | Trang chủ',
    description:
      'Khám phá bộ sưu tập giày thể thao cao cấp LUX Sneakers. Sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng.',
    url: '/',
    images: ['/og-image.png'],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const search = (await searchParams).search;
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <LuxNavbar links={navLinks} />
      {search ? (
        <ProductsContent />
      ) : (
        <>
          <section className="relative flex items-center px-6 pt-24 pb-16">
            <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

            <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
              <RevealOnScroll>
                <HeroSection
                  badge="New Arrival 2025"
                  title={
                    <>
                      NÂNG TẦM
                      <br />
                      <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        PHONG CÁCH
                      </span>
                    </>
                  }
                  description="Trải nghiệm sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng đẳng cấp quốc tế."
                  primaryCtaLabel="MUA NGAY"
                  secondaryCtaLabel="TÌM HIỂU THÊM"
                />
              </RevealOnScroll>

              <RevealOnScroll>
                <HeroVisual />
              </RevealOnScroll>
            </div>
          </section>

          <RevealOnScroll>
            <ProductSliderSection
              title={
                <>
                  SẢN PHẨM{' '}
                  <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    NỔI BẬT
                  </span>
                </>
              }
              description="Tuyển tập những mẫu giày cháy hàng được yêu thích nhất."
              products={featuredProducts}
            />
          </RevealOnScroll>

          <RevealOnScroll>
            <StatsBar items={statsItems} />
          </RevealOnScroll>
        </>
      )}
    </>
  );
}
