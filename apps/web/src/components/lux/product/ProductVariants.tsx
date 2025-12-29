import type { Product } from '@/types/product';

import { Button } from '../Button';

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
            <Button
              key={item.id}
              variant="size"
              state={disabled ? 'disabled' : isActive ? 'active' : 'default'}
              disabled={disabled}
              onClick={() => onSelectSize(item.size)}
            >
              {item.size}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
