'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface WholesaleProduct {
  id: string;
  name: string;
  image: string;
  packSize: string;
  margin: string;
  mrp: string;
  wholesalePrice: string;
  initialQty: number;
}

export default function WholesaleProductCard({ product }: { product: WholesaleProduct }) {
  const [qty, setQty] = useState(product.initialQty);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#7c3bed]/30 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Bulk Badge */}
      <div className="absolute top-3 left-3 z-10 bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
        Bulk
      </div>

      {/* Favorite Button */}
      <button className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center text-[#706189] hover:text-red-500 transition-colors">
        <span className="material-symbols-outlined text-[18px]">favorite</span>
      </button>

      {/* Image Area */}
      <Link href={`/shop/${product.id}`} className="block h-56 w-full bg-[#f7f6f8] relative p-6 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={product.name}
          className="object-contain h-full w-full drop-shadow-md group-hover:scale-105 transition-transform duration-500"
          src={product.image}
        />
      </Link>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-base font-semibold text-[#131118] line-clamp-2 min-h-[3rem] mb-1 hover:text-[#7c3bed] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pack Size + Margin */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded bg-gray-100 text-[#706189] text-xs font-medium">
            {product.packSize}
          </span>
          <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">trending_up</span>
            {product.margin} Margin
          </span>
        </div>

        {/* Pricing + Quantity */}
        <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-[#706189] line-through">MRP: {product.mrp}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-[#131118] font-mono">{product.wholesalePrice}</span>
                <span className="text-xs text-[#706189]">/unit</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#D4AF37] font-medium uppercase tracking-wide">Wholesale Price</p>
            </div>
          </div>

          {/* Quantity Stepper + Cart */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center justify-between bg-[#f7f6f8] rounded-lg p-1">
              <button
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                className="size-8 rounded-md bg-white shadow-sm text-[#131118] hover:text-[#7c3bed] flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <div className="flex flex-col items-center leading-none px-2">
                <span className="font-bold text-sm text-[#131118]">{qty}</span>
                <span className="text-[10px] text-[#706189] uppercase">Cartons</span>
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="size-8 rounded-md bg-white shadow-sm text-[#131118] hover:text-[#7c3bed] flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
            <button
              className={`rounded-lg px-4 py-2 h-10 flex items-center justify-center transition-all ${
                qty > 0
                  ? 'bg-[#7c3bed] hover:bg-[#6b32d1] text-white shadow-lg shadow-[#7c3bed]/20'
                  : 'bg-gray-100 hover:bg-gray-200 text-[#131118]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
