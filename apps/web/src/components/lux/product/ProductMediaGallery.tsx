'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import type { Product, ProductImage } from '@/types/product';

type ProductMediaGalleryProps = {
  product: Product;
  selectedImage: ProductImage;
  thumbnails: ProductImage[];
  onSelectImage: (image: ProductImage) => void;
};

export function ProductMediaGallery({
  product,
  selectedImage,
  thumbnails,
  onSelectImage,
}: ProductMediaGalleryProps) {
  const [lensPosition, setLensPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef || !selectedImage?.src) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Giới hạn lens trong khung ảnh
    const lensSize = 200;
    const minX = lensSize / 2;
    const maxX = rect.width - lensSize / 2;
    const minY = lensSize / 2;
    const maxY = rect.height - lensSize / 2;

    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));

    setLensPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setLensPosition(null);
  };

  useEffect(() => {
    const cursor = document.getElementById('lux-cursor');
    const follower = document.getElementById('lux-cursor-follower');

    if (lensPosition) {
      if (cursor) cursor.style.display = 'none';
      if (follower) follower.style.display = 'none';
    } else {
      if (cursor) cursor.style.display = 'block';
      if (follower) follower.style.display = 'block';
    }
  }, [lensPosition]);

  return (
    <section className="space-y-4">
      <div
        className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-white/5 backdrop-blur-xl"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-amber-500/10 via-transparent to-amber-500/5" />
        <div className="aspect-square w-full cursor-crosshair overflow-hidden">
          <div className="relative flex h-full items-center justify-center bg-black/40">
            {/* Placeholder nếu chưa có ảnh thực tế */}
            {selectedImage?.src ? (
              <>
                <Image
                  unoptimized
                  height={0}
                  width={0}
                  ref={setImageRef}
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="h-full w-full object-contain select-none"
                  draggable={false}
                />
                {/* Lens zoom effect */}
                {lensPosition && imageRef && (
                  <div
                    className="pointer-events-none absolute z-10 rounded-full border-2 border-amber-500/80 bg-white/10 shadow-[0_0_30px_rgba(251,191,36,0.6)] backdrop-blur-sm"
                    style={{
                      width: '200px',
                      height: '200px',
                      left: `${lensPosition.x}px`,
                      top: `${lensPosition.y}px`,
                      backgroundImage: `url(${selectedImage.src})`,
                      backgroundSize: `${imageRef.offsetWidth * 2.5}px ${imageRef.offsetHeight * 2.5}px`,
                      backgroundPosition: `${-(lensPosition.x * 2.5 - 100)}px ${-(lensPosition.y * 2.5 - 100)}px`,
                      backgroundRepeat: 'no-repeat',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </>
            ) : (
              <span className="text-7xl" aria-hidden>
                👟
              </span>
            )}
          </div>
        </div>

        {product.badge ? (
          <div className="absolute top-6 left-6 rounded-full border border-amber-400/40 bg-black/70 px-4 py-1 text-xs font-black tracking-[0.18em] text-amber-400 uppercase">
            {product.badge}
          </div>
        ) : null}
      </div>

      {thumbnails.length > 1 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {thumbnails.map((image) => {
            const isActive = image.id === selectedImage?.id;
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => onSelectImage(image)}
                className={`group relative h-16 w-16 overflow-hidden rounded-lg border bg-white/5 transition-all ${
                  isActive
                    ? 'border-amber-500 ring-2 ring-amber-500/60'
                    : 'border-white/10 hover:border-amber-500/50'
                }`}
              >
                <div className="flex h-full w-full items-center justify-center bg-black/40 text-[10px] text-gray-400">
                  {image.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    image.alt || product.name
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
