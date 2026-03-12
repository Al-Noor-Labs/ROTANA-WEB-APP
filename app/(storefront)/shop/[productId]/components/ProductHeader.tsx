interface ProductHeaderProps {
  brand: string;
  sku: string;
  title: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  bulkBuyAvailable?: boolean;
}

export default function ProductHeader({
  brand,
  sku,
  title,
  rating,
  reviewCount,
  inStock,
  bulkBuyAvailable = true,
}: ProductHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-[#706189]">
            {brand} • SKU: {sku}
          </p>
          <h1 className="mb-2 text-3xl font-bold text-[#131118]">{title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center font-bold text-[#d9a11c]">
              {rating}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span className="text-[#706189] underline decoration-dotted cursor-pointer hover:text-[#7c3bed]">
              {reviewCount} Wholesale Reviews
            </span>
            {inStock && (
              <span className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Bulk Badge */}
        {bulkBuyAvailable && (
          <div className="hidden min-w-[100px] flex-col items-center justify-center rounded-lg border border-[#d9a11c]/30 bg-gradient-to-br from-[#fbf4e2] to-[#fcefc7] p-3 shadow-sm sm:flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d9a11c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9a11c]">
              Bulk Buy
            </span>
            <span className="text-xs font-bold text-[#8a6512]">Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
