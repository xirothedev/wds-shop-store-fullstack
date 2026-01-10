import { Loader2 } from 'lucide-react';

import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';
export default function ProductsLoading() {
  return (
    <>
      <LuxNavbar links={navLinks} cartCount={3} />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <div className="mb-12 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-gray-400" />
          </div>
        </div>
      </main>
    </>
  );
}
