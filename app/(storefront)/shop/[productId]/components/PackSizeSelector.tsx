'use client';

interface PackSize {
  label: string;
  value: string;
}

interface PackSizeSelectorProps {
  sizes: PackSize[];
  selectedSize: string;
  onSelect: (value: string) => void;
}

export default function PackSizeSelector({ sizes, selectedSize, onSelect }: PackSizeSelectorProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 text-sm font-semibold text-[#131118]">Select Pack Size</h3>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => onSelect(size.value)}
            className={`relative overflow-hidden rounded-lg px-4 py-2 transition-colors ${
              selectedSize === size.value
                ? 'border-2 border-[#7c3bed] bg-[#7c3bed]/5 px-5 font-semibold text-[#7c3bed] shadow-sm'
                : 'border border-slate-200 bg-white text-[#706189] hover:border-[#7c3bed] hover:text-[#7c3bed]'
            }`}
          >
            {size.label}
            {selectedSize === size.value && (
              <div className="absolute right-0 top-0 size-2 rounded-bl-lg bg-[#7c3bed]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
