'use client';

import { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  type?: 'image' | 'video';
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  badge?: string;
}

export default function ProductImageGallery({ images, badge }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Main Image */}
      <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-8">
        {badge && (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-[#d9a11c]/20 bg-[#d9a11c]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d9a11c]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
            </svg>
            {badge}
          </span>
        )}
        <button className="absolute right-4 top-4 translate-y-2 transform rounded-full bg-white p-2 text-[#706189] opacity-0 shadow-sm transition-all hover:text-red-500 hover:shadow-md group-hover:translate-y-0 group-hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
        {images[activeIndex] && (
          <img
            alt={images[activeIndex].alt}
            className="h-full w-full object-contain mix-blend-multiply"
            src={images[activeIndex].src}
          />
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex aspect-square items-center justify-center rounded-xl border-2 bg-white p-2 transition-all ${
              activeIndex === index
                ? 'border-[#7c3bed] ring-2 ring-[#7c3bed]/20'
                : 'border-slate-200 opacity-70 hover:border-[#7c3bed]/50 hover:opacity-100'
            }`}
          >
            {image.type === 'video' ? (
              <div className="relative flex h-full w-full items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#706189]">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                <div className="absolute inset-0 rounded-lg bg-black/5" />
              </div>
            ) : (
              <img
                alt={image.alt}
                className="h-full w-full object-contain"
                src={image.src}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
