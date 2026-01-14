import { ReactNode } from 'react';

import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';

interface ConfirmOrderPageProps {
  children: ReactNode;
}

export default async function ConfirmOrderPage({
  children,
}: ConfirmOrderPageProps) {
  return (
    <>
      <LuxNavbar links={navLinks} />
      <div className="glass-auth mx-auto grid w-full max-w-7xl grid-cols-1 overflow-hidden rounded-3xl border border-white/5 bg-black/60 pt-32 shadow-2xl backdrop-blur-2xl">
        <div className="flex w-full items-center bg-black/40 p-6 md:p-12">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
