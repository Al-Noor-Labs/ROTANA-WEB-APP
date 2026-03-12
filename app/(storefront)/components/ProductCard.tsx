import Link from 'next/link';

export interface Product {
  id: string;
  name: string;
  weight: string;
  price: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col hover:border-[#7c3bed]/40 transition-colors group">
      <div className="relative w-full aspect-[4/3] bg-[#f7f6f8] rounded-lg mb-3 overflow-hidden">
        {product.badge && (
          <div className={`absolute top-2 left-2 ${product.badgeColor || 'bg-green-500'} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
            {product.badge}
          </div>
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition-colors backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={product.name}
          src={product.image}
        />
      </div>
      <h3 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h3>
      <p className="text-xs text-slate-500 mb-2">{product.weight}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-slate-900">{product.price}</span>
        <button className="size-8 rounded-lg bg-[#7c3bed]/10 text-[#7c3bed] flex items-center justify-center hover:bg-[#7c3bed] hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
        </button>
      </div>
    </Link>
  );
}
