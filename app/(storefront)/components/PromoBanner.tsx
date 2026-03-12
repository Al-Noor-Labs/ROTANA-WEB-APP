import Link from 'next/link';

export default function PromoBanner() {
  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl overflow-hidden mb-12 relative flex flex-col md:flex-row items-center">
      <div className="p-8 md:w-1/2 z-10">
        <span className="inline-block px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-bold rounded mb-4">
          LIMITED OFFER
        </span>
        <h2 className="text-3xl font-bold mb-2">Free Delivery on Your First Order</h2>
        <p className="text-slate-300 mb-6">
          Get your household essentials delivered for free. Use code{' '}
          <span className="text-white font-mono font-bold bg-white/10 px-2 py-1 rounded mx-1">WELCOME100</span>{' '}
          at checkout.
        </p>
        <Link href="/shop" className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
          Order Now
        </Link>
      </div>
      <div className="md:w-1/2 h-full absolute right-0 top-0 bottom-0 hidden md:block">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-[1]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          alt="Fresh groceries delivery"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1A_emr1dMS_aFuXO8ocuz20S9tm9J7SdCHMBW-sv-Bq-1v3gfJBBUtmsiCiFChh1PQ-LGKJC5KfkmFTMsWVLbda0LY9j3mj_c0jDon8kcpEBSR_9FNN-YCcYbxrMlgTaBFbX6NTiDwVsWSCv_hQsps6ylum3mxclXuF0PKRUt85BOtwdjkPq7r0AsFohYp5Q8irSoIZgCrT3ZrD2i8k6XNyTW_5EhhRA93D0r1xZ4KGF55M-og_sncxj6lkhsaNPG_NZWMyLcxT0"
        />
      </div>
    </div>
  );
}
