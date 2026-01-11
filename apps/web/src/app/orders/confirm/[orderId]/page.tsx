import { navLinks } from '@/components/lux/data';
import { LuxNavbar } from '@/components/lux/LuxNavbar';
import { ConfirmOrder } from '@/components/lux/order/ConfirmOrder';

export interface ConfirmOrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function ConfirmOrderPage({
  params,
}: ConfirmOrderPageProps) {
  const { orderId } = await params;

  return (
    <>
      <LuxNavbar links={navLinks} />
      <ConfirmOrder orderId={orderId} />
    </>
  );
}
