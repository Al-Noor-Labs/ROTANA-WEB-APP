'use client';

import Link from 'next/link';
import CartItemRow from './CartItemRow';
import type { CartItem } from './CartItemRow';

interface CartTableProps {
  items: CartItem[];
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

export default function CartTable({ items, onQuantityChange, onRemove, onClearCart }: CartTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4 w-[40%]">Product Details</th>
              <th className="px-6 py-4 w-[20%]">Cartons (Qty)</th>
              <th className="px-6 py-4 w-[15%] text-right">Price/Unit</th>
              <th className="px-6 py-4 w-[10%] text-center">GST</th>
              <th className="px-6 py-4 w-[15%] text-right">Line Total</th>
              <th className="px-4 py-4 w-[5%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-200 flex justify-between items-center">
        <Link
          href="/shop"
          className="text-[#7c3bed] hover:text-[#6926d4] font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add More Items from Catalog
        </Link>
        <button
          onClick={onClearCart}
          className="text-slate-500 hover:text-red-500 text-sm flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          Clear Cart
        </button>
      </div>
    </div>
  );
}
