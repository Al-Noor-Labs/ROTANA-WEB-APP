interface PricingSlab {
  quantityRange: string;
  tier: string;
  tierStyle: 'standard' | 'wholesale' | 'super-wholesale';
  unitPrice: string;
  margin: string;
  highlighted?: boolean;
}

interface PricingSlabsTableProps {
  slabs: PricingSlab[];
}

export default function PricingSlabsTable({ slabs }: PricingSlabsTableProps) {
  const getTierBadge = (slab: PricingSlab) => {
    if (slab.tierStyle === 'wholesale') {
      return (
        <span className="inline-flex items-center rounded border border-[#7c3bed]/20 bg-[#7c3bed]/10 px-2 py-0.5 text-xs font-medium text-[#7c3bed]">
          {slab.tier}
        </span>
      );
    }
    if (slab.tierStyle === 'super-wholesale') {
      return (
        <span className="inline-flex items-center rounded border border-[#d9a11c]/20 bg-[#d9a11c]/10 px-2 py-0.5 text-xs font-medium text-[#d9a11c]">
          {slab.tier}
        </span>
      );
    }
    return <span className="text-[#706189]">{slab.tier}</span>;
  };

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3">
        <h3 className="flex items-center gap-2 font-semibold text-[#131118]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3bed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" />
          </svg>
          Wholesale Pricing Slabs
        </h3>
        <span className="text-xs text-[#706189]">*Prices exclusive of GST</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-white text-xs uppercase text-[#706189]">
            <tr>
              <th className="px-6 py-3 font-medium">Quantity (Bags)</th>
              <th className="px-6 py-3 font-medium">Tier</th>
              <th className="px-6 py-3 text-right font-medium">Unit Price</th>
              <th className="px-6 py-3 text-right font-medium">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slabs.map((slab, index) => (
              <tr
                key={index}
                className={`transition-colors hover:bg-slate-50 ${
                  slab.highlighted ? 'bg-[#7c3bed]/5' : ''
                }`}
              >
                <td
                  className={`px-6 py-4 ${
                    slab.highlighted
                      ? 'font-bold text-[#7c3bed]'
                      : 'font-medium text-[#131118]'
                  }`}
                >
                  {slab.quantityRange}
                </td>
                <td className="px-6 py-4">{getTierBadge(slab)}</td>
                <td
                  className={`px-6 py-4 text-right ${
                    slab.highlighted
                      ? 'font-bold text-[#7c3bed]'
                      : 'font-medium text-[#131118]'
                  }`}
                >
                  {slab.unitPrice}
                </td>
                <td
                  className={`px-6 py-4 text-right text-green-600 ${
                    slab.highlighted ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {slab.margin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
