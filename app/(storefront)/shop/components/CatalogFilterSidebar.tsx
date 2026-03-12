'use client';

import { useState } from 'react';

const CATEGORIES = [
  { id: 'atta', label: 'Atta & Flours', icon: 'grain' },
  { id: 'rice', label: 'Rice & Grains', icon: 'rice_bowl' },
  { id: 'dals', label: 'Dals & Pulses', icon: 'grass' },
  { id: 'spices', label: 'Spices & Masalas', icon: 'local_fire_department' },
  { id: 'oils', label: 'Edible Oils', icon: 'opacity' },
];

const BRANDS = [
  { id: 'aashirvaad', label: 'Aashirvaad', count: 124 },
  { id: 'fortune', label: 'Fortune', count: 85 },
  { id: 'pillsbury', label: 'Pillsbury', count: 42 },
  { id: 'nature-fresh', label: 'Nature Fresh', count: 36 },
];

const PACK_SIZES = ['50kg', '25kg', '10kg', '5kg', '1kg'];

export default function CatalogFilterSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState('atta');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['aashirvaad']);
  const [activePackSize, setActivePackSize] = useState('50kg');

  const toggleBrand = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[300px] bg-white overflow-y-auto
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-20 lg:z-0 lg:h-fit lg:translate-x-0 lg:bg-transparent lg:w-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between p-5 lg:hidden">
          <h3 className="text-lg font-bold text-[#131118]">Filters</h3>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-[#f7f6f8] flex items-center justify-center text-[#706189] hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="lg:space-y-8 space-y-6 px-5 pb-5 lg:px-0 lg:pb-0">
          {/* Categories */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#131118]">Categories</h3>
              <span className="material-symbols-outlined text-[#706189] text-[20px] cursor-pointer">remove</span>
            </div>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 w-full p-2 rounded-lg cursor-pointer transition-colors text-left ${
                    activeCategory === cat.id
                      ? 'bg-[#7c3bed]/5 text-[#7c3bed]'
                      : 'text-[#706189] hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  <span className="font-medium text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#131118]">Brand</h3>
              <span className="material-symbols-outlined text-[#706189] text-[20px] cursor-pointer">remove</span>
            </div>
            <div className="space-y-3">
              {BRANDS.map((brand) => (
                <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                    className="rounded border-gray-300 text-[#7c3bed] focus:ring-[#7c3bed]/20 size-4"
                  />
                  <span className="text-sm text-[#131118] group-hover:text-[#7c3bed] transition-colors">
                    {brand.label}
                  </span>
                  <span className="ml-auto text-xs text-[#706189]">{brand.count}</span>
                </label>
              ))}
              <button className="text-sm font-medium text-[#7c3bed] hover:underline pt-1">
                Show more +
              </button>
            </div>
          </div>

          {/* Pack Size */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#131118]">Pack Size</h3>
              <span className="material-symbols-outlined text-[#706189] text-[20px] cursor-pointer">remove</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PACK_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setActivePackSize(size)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activePackSize === size
                      ? 'bg-[#7c3bed] text-white'
                      : 'bg-[#f7f6f8] text-[#131118] hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Wholesale Price Range */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#131118]">Wholesale Price</h3>
              <span className="material-symbols-outlined text-[#706189] text-[20px] cursor-pointer">remove</span>
            </div>
            {/* Range slider visual */}
            <div className="relative h-1.5 w-full bg-gray-200 rounded-full mb-4">
              <div className="absolute h-full bg-[#7c3bed] rounded-full left-[20%] right-[30%]" />
              <div className="absolute size-4 bg-white border-2 border-[#7c3bed] rounded-full top-1/2 -translate-y-1/2 left-[20%] shadow cursor-pointer" />
              <div className="absolute size-4 bg-white border-2 border-[#7c3bed] rounded-full top-1/2 -translate-y-1/2 right-[30%] shadow cursor-pointer" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="px-3 py-1 rounded border border-gray-200 bg-gray-50 text-[#131118]">₹500</div>
              <span className="text-gray-400">-</span>
              <div className="px-3 py-1 rounded border border-gray-200 bg-gray-50 text-[#131118]">₹2500</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
