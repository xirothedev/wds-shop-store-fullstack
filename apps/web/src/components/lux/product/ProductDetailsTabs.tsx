import { useState } from 'react';

import type { Product, ProductSpecItem } from '@/types/product';

import { Button } from '../Button';

type ProductDetailsTabsProps = {
  product: Product;
};

type TabKey = 'description' | 'specs' | 'reviews';

const TAB_LABELS: Record<TabKey, string> = {
  description: 'Mô tả chi tiết',
  specs: 'Thông số kỹ thuật',
  reviews: 'Đánh giá',
};

function SpecsTable({ specs }: { specs: ProductSpecItem[] }) {
  if (!specs.length) return null;

  return (
    <dl className="grid gap-3 rounded-2xl border border-white/10 bg-black/40 p-6 md:grid-cols-2">
      {specs.map((item) => (
        <div
          key={item.key}
          className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0"
        >
          <dt className="text-xs font-semibold tracking-[0.18em] text-gray-400 uppercase">
            {item.key}
          </dt>
          <dd className="text-sm text-gray-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  const specs = product.specs ?? [];

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex gap-2 rounded-2xl bg-black/40 p-1 text-sm">
        {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
          <Button
            key={key}
            variant="tab"
            state={activeTab === key ? 'active' : 'default'}
            onClick={() => setActiveTab(key)}
          >
            {TAB_LABELS[key]}
          </Button>
        ))}
      </div>

      <div className="space-y-4 text-sm text-gray-200">
        {activeTab === 'description' ? (
          <>
            <p className="leading-relaxed">{product.description}</p>
            {product.shortDescription ? (
              <p className="text-gray-400">{product.shortDescription}</p>
            ) : null}
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-200">
              <li>Thiết kế tối ưu cho trải nghiệm di chuyển hàng ngày.</li>
              <li>Phong cách hiện đại, dễ phối với nhiều outfit.</li>
              <li>Bền bỉ, phù hợp với khí hậu nóng ẩm tại Việt Nam.</li>
            </ul>
          </>
        ) : null}

        {activeTab === 'specs' ? <SpecsTable specs={specs} /> : null}

        {activeTab === 'reviews' ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-black/40 p-4">
              <div className="flex items-end gap-3">
                <div className="text-4xl font-black text-amber-400">
                  {product.ratingValue.toFixed(1)}
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Trên 5.0 từ {product.ratingCount} lượt đánh giá</p>
                  <p className="text-xs text-gray-500">
                    Tính năng đánh giá chi tiết sẽ được cập nhật sau.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
