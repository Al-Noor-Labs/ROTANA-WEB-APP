'use client';

interface ProductActionBarProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  unitPrice: number;
  unit?: string;
}

export default function ProductActionBar({
  quantity,
  onQuantityChange,
  unitPrice,
  unit = 'bags',
}: ProductActionBarProps) {
  const totalAmount = quantity * unitPrice;

  return (
    <div className="sticky bottom-4 z-10 mt-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-sm md:flex-row">
      {/* Quantity Stepper */}
      <div className="flex w-full items-center gap-3 md:w-auto">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-[#131118] transition-colors hover:bg-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <input
          className="w-16 border-none bg-transparent p-0 text-center text-xl font-bold text-[#131118] focus:ring-0"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
        />
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-[#131118] transition-colors hover:bg-slate-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
        </button>
        <span className="ml-1 text-sm text-[#706189]">{unit}</span>
      </div>

      {/* Divider */}
      <div className="hidden h-8 w-px bg-slate-200 md:block" />

      {/* Total Amount */}
      <div className="flex flex-col">
        <span className="text-xs text-[#706189]">Total Amount</span>
        <span className="text-xl font-bold text-[#131118]">₹{totalAmount.toLocaleString('en-IN')}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-1 justify-end gap-3">
        <button className="flex-1 whitespace-nowrap rounded-xl border border-slate-200 px-6 py-3 font-semibold text-[#131118] transition-colors hover:bg-slate-50 md:flex-none">
          <span className="hidden md:inline">Add to </span>Quick Reorder
          <span className="md:hidden"> Save</span>
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#7c3bed] px-8 py-3 font-bold text-white shadow-lg shadow-[#7c3bed]/25 transition-transform hover:bg-[#7c3bed]/90 active:scale-95 md:flex-none">
          Add Cartons
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
