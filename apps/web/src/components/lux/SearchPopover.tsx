'use client';

import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import useDebounce from '@/lib/hooks/useDebounce';
import { suggestions as getSuggestions } from '@/lib/api/search.api';
type Props = {
  onClose?: () => void;
};

export function SearchPopover({ onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 500);
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') as
    | 'MALE'
    | 'FEMALE'
    | 'UNISEX'
    | null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['suggestions', debounced, gender],
    queryFn: () => getSuggestions(debounced, gender || undefined),
    enabled: !!debounced && debounced.length > 0,
  });

  useEffect(() => {
    inputRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.();
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
 
  const handleChange = (value: string) => {
    setInput(value);
  };

  const performSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    // perform immediate search action here (navigate or fetch)
    console.log('enter search:', trimmed);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(input);
    }
  };

  

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose?.()}
      />

      <div className="relative w-full max-w-2xl rounded-lg border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            ref={inputRef}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full bg-transparent text-white outline-none placeholder:text-gray-400"
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={() => onClose?.()}
            className="ml-2 rounded-md border border-white/10 px-3 py-1 text-sm text-gray-300 hover:bg-white/5"
            aria-label="Đóng"
          >
            Esc
          </button>
        </div>

        <div className="mt-4 max-h-56 overflow-y-auto">
          <div className="mb-2 px-3">
            <div className="flex items-center justify-between">
             {input.length > 0 &&  <h4 className="mb-2 px-1 text-sm font-semibold text-gray-200">
                              Tìm kiếm: {input}
              </h4>}
              <div className="w-11" />
            </div>
          </div>

          {isLoading && (
            <div className="px-3 py-4 text-center flex items-center justify-center text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          {error && (
            <div className="px-3 py-4 text-center text-sm text-red-400">
              {error.message}
            </div>
          )}

          {!isLoading && !error && data?.length === 0 && debounced && (
            <div className="px-3 py-4 text-center text-sm text-gray-400">
              Không tìm thấy 
            </div>
          )}

          {!isLoading && !error && data && data?.length > 0 && (
            <ul className="space-y-2 px-1">
              {data?.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-white/5"
                >
                  <span className="text-gray-300">{item}</span>

                  <button>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPopover;
