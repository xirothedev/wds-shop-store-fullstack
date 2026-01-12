import { RxCrossCircled } from 'react-icons/rx';

export default function OrderFailedPage() {
  return (
    <>
      <div className="flex h-screen max-h-100 w-full flex-col items-center justify-center">
        <div className="m-auto flex flex-col items-center justify-center">
          <RxCrossCircled color="red" className="h-20 w-20" />
          <p className="mt-8 text-2xl">Tạo đơn hàng thất bại!</p>
          <p className="text-2xl">Hãy kiểm tra đơn hàng của bạn</p>
        </div>
      </div>
    </>
  );
}
