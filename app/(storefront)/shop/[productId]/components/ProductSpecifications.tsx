interface Specification {
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specs: Specification[];
}

export default function ProductSpecifications({ specs }: ProductSpecificationsProps) {
  return (
    <div className="mt-16 border-t border-slate-200 pt-10">
      <h2 className="mb-6 text-xl font-bold text-[#131118]">Product Specifications</h2>
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex border-b border-slate-100 pb-2">
            <span className="w-32 shrink-0 text-[#706189]">{spec.label}</span>
            <span className="font-medium text-[#131118]">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
