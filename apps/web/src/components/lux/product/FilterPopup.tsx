'use client';

import { X } from 'lucide-react';
import {
  useRouter,
  useSearchParams,
} from 'next/dist/client/components/navigation';
import React from 'react';
import { createPortal } from 'react-dom';

interface FilterPopupProps {
  isOpen?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FilterCategory {
  id: string;
  label: string;
  options: Array<{ id: string; label: string }>;
}

const FilterPopup = ({ isOpen, setOpen }: FilterPopupProps) => {
  const filterCategories: FilterCategory[] = [
    {
      id: 'priceCurrent',
      label: 'GIÁ',
      options: [
        { id: 'asc', label: 'Thấp đến Cao' },
        { id: 'desc', label: 'Cao đến Thấp' },
      ],
    },
    {
      id: 'name',
      label: 'TÊN',
      options: [
        { id: 'asc', label: 'A → Z' },
        { id: 'desc', label: 'Z → A' },
      ],
    },
    {
      id: 'date',
      label: 'NGÀY',
      options: [
        { id: 'today', label: 'Hôm nay' },
        { id: 'week', label: 'Tuần này' },
        { id: 'month', label: 'Tháng này' },
        { id: 'year', label: 'Năm nay' },
      ],
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterSelect = (filterId: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete('sortBy');
    params.delete('sortValue');
    params.delete('orderBy');
    params.set('sortBy', filterId);

    if (filterId === 'priceCurrent' || filterId === 'name') {
      params.set('orderBy', value);
    } else {
      params.set('sortValue', value);
    }

    router.push(`?${params.toString()}`);
    setOpen?.(false);
  };

  const content = isOpen && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen?.(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-2xl border border-amber-500/20 bg-linear-to-br from-black/95 to-black/85 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-500/10 p-6">
            <h2 className="text-2xl font-bold text-white">Bộ lọc tìm kiếm</h2>
            <button
              onClick={() => setOpen?.(false)}
              className="rounded-full p-2 transition-all hover:bg-white/10"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-amber-500/10">
            {filterCategories.map((category) => (
              <div key={category.id} className="flex-1 px-6 py-4 text-center">
                <h3 className="font-semibold text-amber-400">
                  {category.label}
                </h3>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${filterCategories.length}, 1fr)`,
              }}
            >
              {filterCategories.map((category) => (
                <div key={category.id} className="flex flex-col gap-2">
                  {category.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleFilterSelect(category.id, option.id)}
                      className="flex cursor-pointer items-center justify-center rounded-lg border border-amber-500/20 bg-white/5 px-3 py-2.5 transition-all hover:border-amber-500/40 hover:bg-white/10"
                    >
                      {' '}
                      {option.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default FilterPopup;
