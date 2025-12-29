import type { Product } from '@/types/product';

type ProductVariantsProps = {
  product: Product;
  selectedSize?: string;
  onSelectSize: (size: string) => void;
};

export function ProductVariants({
  product,
  selectedSize,
  onSelectSize,
}: ProductVariantsProps) {
  const sizeStocks = product.sizeStocks ?? [];

  if (!sizeStocks.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-200">Kích cỡ</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizeStocks.map((item) => {
          const isActive = item.size === selectedSize;
          const disabled = item.stock === 0;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSize(item.size)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                disabled
                  ? 'cursor-not-allowed border-white/5 bg-black/30 text-gray-500 line-through'
                  : isActive
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                    : 'border-white/10 bg-black/40 text-gray-100 hover:border-amber-500/60'
              }`}
            >
              {item.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
