'use client';

import Link from 'next/link';

interface CartHeaderProps {
  orderId: string;
  creditLimit: number;
  creditUsedPercent: number;
}

export default function CartHeader({ orderId, creditLimit, creditUsedPercent }: CartHeaderProps) {
  const availablePercent = 100 - creditUsedPercent;
  const formattedLimit = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(creditLimit);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/shop"
            className="text-slate-500 hover:text-[#7c3bed] flex items-center text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">arrow_back</span>
            Back to Catalog
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Wholesale Cart</h2>
        <p className="text-slate-500 mt-1">
          Order ID: <span className="font-mono text-[#7c3bed] font-medium">{orderId}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Credit Limit:</span>
        <span className="font-mono font-bold text-lg text-slate-900">{formattedLimit}</span>
        <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden ml-2">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-500"
            style={{ width: `${availablePercent}%` }}
          />
        </div>
        <span className="text-xs text-green-600 font-bold ml-1">{availablePercent}% Available</span>
      </div>
    </div>
  );
}
