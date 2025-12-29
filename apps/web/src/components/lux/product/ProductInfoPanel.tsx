import { Clock, RefreshCw, ShieldCheck } from 'lucide-react';

import type { Product, ProductSizeStock } from '@/types/product';

import { ProductVariants } from './ProductVariants';

type ProductInfoPanelProps = {
  product: Product;
  selectedSize?: string;
  quantity: number;
  maxQuantity: number;
  onSelectSize: (size: string) => void;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function getStockLabel(sizeStocks?: ProductSizeStock[], selectedSize?: string) {
  if (!sizeStocks || !selectedSize) return null;
  const record = sizeStocks.find((item) => item.size === selectedSize);
  if (!record) return null;
  if (record.stock === 0) return 'Hết hàng';
  if (record.stock <= 3) return `Chỉ còn ${record.stock} đôi`;
  return `Còn ${record.stock} đôi`;
}

export function ProductInfoPanel({
  product,
  selectedSize,
  quantity,
  maxQuantity,
  onSelectSize,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}: ProductInfoPanelProps) {
  const {
    name,
    shortDescription,
    priceCurrent,
    priceOriginal,
    priceDiscount,
    ratingValue,
    ratingCount,
    sizeStocks,
  } = product;

  const stockLabel = getStockLabel(sizeStocks, selectedSize);

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {name}
        </h1>
        {shortDescription ? (
          <p className="text-sm text-gray-300">{shortDescription}</p>
        ) : null}

        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="flex items-center gap-1 text-amber-400">
            <span aria-hidden>★</span>
            <span className="font-semibold">
              {ratingValue.toFixed(1)} / 5.0
            </span>
          </div>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span>{ratingCount} đánh giá</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black text-amber-500">
            {formatCurrency(priceCurrent)}
          </span>
          {priceOriginal && priceOriginal > priceCurrent ? (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(priceOriginal)}
            </span>
          ) : null}
          {priceDiscount ? (
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              -{formatCurrency(priceDiscount)}
            </span>
          ) : null}
        </div>
        {stockLabel ? (
          <p className="text-xs font-medium tracking-[0.18em] text-amber-400 uppercase">
            {stockLabel}
          </p>
        ) : null}
      </div>

      <ProductVariants
        product={product}
        selectedSize={selectedSize}
        onSelectSize={onSelectSize}
      />

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-200">
        <span>Số lượng</span>
        <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-3 py-1">
          <button
            type="button"
            onClick={onDecreaseQuantity}
            disabled={quantity <= 1}
            className={`h-7 w-7 rounded-full border text-lg leading-none transition-all ${
              quantity <= 1
                ? 'cursor-not-allowed border-white/5 text-gray-500'
                : 'border-white/15 text-gray-200 hover:border-amber-500 hover:text-amber-400'
            }`}
          >
            –
          </button>
          <span className="w-6 text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncreaseQuantity}
            disabled={quantity >= maxQuantity}
            className={`h-7 w-7 rounded-full border text-lg leading-none transition-all ${
              quantity >= maxQuantity
                ? 'cursor-not-allowed border-white/5 text-gray-500'
                : 'border-white/15 text-gray-200 hover:border-amber-500 hover:text-amber-400'
            }`}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={onAddToCart}
          className="flex-1 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 px-6 py-4 text-sm font-bold tracking-[0.18em] text-black uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)]"
        >
          Thêm vào giỏ
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold tracking-[0.18em] text-white uppercase transition-all hover:bg-white/10"
        >
          Mua ngay
        </button>
      </div>

      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-amber-500/15 p-1.5 text-amber-400">
            <Clock className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-200">
              Giao nhanh 24h nội thành
            </p>
            <p className="text-xs text-gray-400">
              Áp dụng với đơn đặt trước 16:00, hỗ trợ COD linh hoạt.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-amber-500/15 p-1.5 text-amber-400">
            <RefreshCw className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-200">
              Đổi trả trong 7 ngày
            </p>
            <p className="text-xs text-gray-400">
              Hỗ trợ đổi size hoặc mẫu khác nếu sản phẩm chưa qua sử dụng.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-amber-500/15 p-1.5 text-amber-400">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-200">
              Bảo hành keo 12 tháng
            </p>
            <p className="text-xs text-gray-400">
              Bảo hành chính hãng lỗi keo bong tróc trong suốt thời gian sử
              dụng.
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
}
