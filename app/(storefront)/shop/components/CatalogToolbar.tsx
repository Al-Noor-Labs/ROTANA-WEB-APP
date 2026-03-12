'use client';

export default function CatalogToolbar({
  onToggleFilters,
}: {
  onToggleFilters: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {/* Mobile filter toggle */}
      <button
        onClick={onToggleFilters}
        className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-[#131118] hover:border-[#7c3bed]/40 hover:text-[#7c3bed] transition-colors mr-2"
      >
        <span className="material-symbols-outlined text-[16px]">filter_list</span>
        Filters
      </button>

      <span className="text-sm text-[#706189] mr-2">Active filters:</span>

      {/* Active filter chips */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c3bed]/10 text-[#7c3bed] text-xs font-medium border border-[#7c3bed]/20">
        Brand: Aashirvaad
        <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-[#6b32d1]">close</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7c3bed]/10 text-[#7c3bed] text-xs font-medium border border-[#7c3bed]/20">
        Pack Size: 50kg
        <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-[#6b32d1]">close</span>
      </div>

      <button className="text-xs text-[#706189] hover:text-[#7c3bed] underline ml-auto">
        Clear all filters
      </button>
    </div>
  );
}
