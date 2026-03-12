interface InfoItem {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
}

interface ProductInfoCardsProps {
  items: InfoItem[];
}

export default function ProductInfoCards({ items }: ProductInfoCardsProps) {
  return (
    <div className="space-y-4 py-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={`rounded-lg p-2 ${item.iconBg}`}>
            {item.icon}
          </div>
          <div>
            <h5 className="text-sm font-semibold text-[#131118]">{item.title}</h5>
            <p className="text-xs text-[#706189]">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
