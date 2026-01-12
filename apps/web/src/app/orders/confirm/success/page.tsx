import { LuCircleCheck } from 'react-icons/lu';

export default function OrderSuccessPage() {
  return (
    <>
      <div className="flex h-screen max-h-100 w-full flex-col items-center justify-center">
        <div className="m-auto flex flex-col items-center justify-center">
          <LuCircleCheck color="green" className="h-20 w-20" />
          <p className="mt-8 text-2xl">Tạo đơn hàng thành công</p>
        </div>
      </div>
    </>
  );
}
