'use client';

import { useState, useCallback } from 'react';

interface MarginCalculatorProps {
  mrp: number;
  wholesalePrice: number;
}

export default function MarginCalculator({ mrp, wholesalePrice }: MarginCalculatorProps) {
  const [sellingPrice, setSellingPrice] = useState(mrp - 200);

  const profit = sellingPrice - wholesalePrice;

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSellingPrice(value);
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-[#f7f6f8] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold text-[#131118]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
          </svg>
          Margin Calculator
        </h4>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[#706189]">
            Your Selling Price (MRP ₹{mrp.toLocaleString('en-IN')})
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#706189]">₹</span>
            <input
              className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-7 pr-3 text-sm font-medium text-[#131118] shadow-sm focus:border-[#7c3bed] focus:ring-[#7c3bed]"
              type="number"
              value={sellingPrice}
              onChange={handlePriceChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-white p-3 shadow-sm">
          <span className="text-sm text-[#706189]">Your Profit / Unit</span>
          <span className={`text-lg font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
