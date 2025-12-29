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
  metadataBase: new URL('https://luxsneakers.com'),
  title: {
    default: 'LUX Sneakers | Black & Gold Edition',
    template: '%s | LUX Sneakers',
  },
  description:
    'Nâng tầm phong cách với LUX Sneakers – sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng. Giày thể thao cao cấp cho nam, nữ và unisex.',
  keywords: [
    'giày thể thao',
    'sneakers',
    'giày chạy bộ',
    'giày lifestyle',
    'LUX Sneakers',
    'giày cao cấp',
    'giày nam',
    'giày nữ',
  ],
  authors: [{ name: 'LUX Sneakers' }],
  creator: 'LUX Sneakers',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'LUX Sneakers',
    title: 'LUX Sneakers | Black & Gold Edition',
    description:
      'Nâng tầm phong cách với LUX Sneakers – sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LUX Sneakers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUX Sneakers | Black & Gold Edition',
    description:
      'Nâng tầm phong cách với LUX Sneakers – sự kết hợp hoàn hảo giữa công nghệ thể thao và thiết kế sang trọng.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Thêm Google Search Console verification code nếu có
    // google: 'your-google-verification-code',
  },
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
