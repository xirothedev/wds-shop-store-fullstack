import type { ReactNode } from 'react';

import { AuthInfoPanel } from '@/components/lux/auth/AuthInfoPanel';
import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <LuxNavbar links={navLinks} cartCount={0} />

      <div className="glass-auth grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-white/5 bg-black/60 pt-32 shadow-2xl backdrop-blur-2xl md:grid-cols-2">
        <AuthInfoPanel />

        <div className="flex items-center bg-black/40 p-8 md:p-12">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </>
  );
}
