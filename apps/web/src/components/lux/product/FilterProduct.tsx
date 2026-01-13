'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Button } from '../Button';
import FilterPopup from './FilterPopup';

type SortOption = 'latest' | 'trending' | 'appreciated' | "";

interface FilterOption {
  id: SortOption;
  label: string;
  isHighlight?: boolean;
}

const FilterProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  
  const filterOptions: FilterOption[] = [
    { id: 'appreciated', label: 'Đánh giá tốt' },
    { id: 'latest', label: 'Mới Nhất' },
    { id: 'trending', label: 'Bán Chạy', isHighlight: true },
  ];
  
  const activeSort = searchParams.get('sortBy') as SortOption;
  
  const handleFilterChange = (sortId: SortOption) => {
 
    const params = new URLSearchParams(searchParams);
    params.delete('sortBy');
    params.delete('sortValue');
    params.delete('orderBy');
    params.set('sortBy', sortId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full px-6 mt-12 rounded-2xl  bg-gradient-to-r from-black/40 to-black/20   backdrop-blur-xl">
      <div className="flex  max-w-7xl mx-auto flex-wrap items-center   gap-4 ">
        {/* Sort Label */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-300">
            Sắp xếp theo
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFilterChange(option.id)}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                option.isHighlight
                  ? activeSort === option.id
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]'
                    : 'border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  : activeSort === option.id
                    ? 'border border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'border border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Optional: Additional controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition-all hover:border-amber-500/40 hover:bg-white/10"
                      title="Filters"
                      onClick={() => setOpen(true)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
          </div>
          <FilterPopup isOpen={open} setOpen={setOpen} />
    </div>
  );
};

export default FilterProduct;