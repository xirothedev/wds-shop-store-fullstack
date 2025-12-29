import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { footerLinks, footerSocials } from '@/components/lux/data';
import { LuxFooter } from '@/components/lux/LuxFooter';
import { RevealOnScroll } from '@/components/lux/RevealOnScroll';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LUX Sneakers | Black & Gold Edition',
  description:
    'Nâng tầm phong cách với LUX Sneakers – sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        {children}
        <RevealOnScroll>
          <LuxFooter links={footerLinks} socials={footerSocials} />
        </RevealOnScroll>
      </body>
    </html>
  );
}
