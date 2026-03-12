'use client';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  sku: string;
  packSize: string;
  unitsPerCarton: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  pricePerUnit: number;
  mrp: number;
  gstPercent: number;
  quantity: number;
}

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const lineTotal = item.pricePerUnit * item.quantity * item.unitsPerCarton;
  const totalUnits = item.quantity * item.unitsPerCarton;

  const handleDecrement = () => {
    if (item.quantity > 1) onQuantityChange(item.id, item.quantity - 1);
  };

  const handleIncrement = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) onQuantityChange(item.id, val);
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <tr className="group hover:bg-slate-50/80 transition-colors">
      {/* Product Details */}
      <td className="px-6 py-4 align-top">
        <div className="flex gap-4">
          <div className="size-16 shrink-0 rounded-lg bg-gray-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            <img alt={item.name} className="object-cover w-full h-full" src={item.image} />
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-sm text-slate-500 mt-1">SKU: {item.sku}</p>
            {item.stockStatus === 'in-stock' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>In Stock</span>
              </div>
            )}
            {item.stockStatus === 'low-stock' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded w-fit">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span>Low Stock</span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Cartons (Qty) */}
      <td className="px-6 py-4 align-top">
        <div className="flex items-center w-fit border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
          <button
            onClick={handleDecrement}
            className="px-3 py-1.5 hover:bg-gray-200 text-slate-500 transition-colors"
          >
            −
          </button>
          <input
            className="w-12 text-center border-none bg-transparent text-sm font-mono focus:ring-0 p-0 text-slate-900"
            type="text"
            value={item.quantity}
            onChange={handleInputChange}
          />
          <button
            onClick={handleIncrement}
            className="px-3 py-1.5 hover:bg-gray-200 text-slate-500 transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 ml-1">{totalUnits} units total</p>
      </td>

      {/* Price/Unit */}
      <td className="px-6 py-4 align-top text-right">
        <p className="font-mono text-slate-900">{formatCurrency(item.pricePerUnit)}</p>
        <p className="text-xs text-slate-400 line-through mt-0.5">{formatCurrency(item.mrp)}</p>
      </td>

      {/* GST */}
      <td className="px-6 py-4 align-top text-center">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-slate-500">
          {item.gstPercent}%
        </span>
      </td>

      {/* Line Total */}
      <td className="px-6 py-4 align-top text-right">
        <p className="font-mono font-medium text-slate-900">{formatCurrency(lineTotal)}</p>
      </td>

      {/* Delete */}
      <td className="px-4 py-4 align-top text-right">
        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </td>
    </tr>
  );
}
