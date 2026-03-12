export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-slate-900 mb-4">
            <div className="size-6 rounded bg-[#7c3bed] flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /></svg>
            </div>
            <h3 className="font-bold">Rotana</h3>
          </div>
          <p className="text-sm text-slate-500">Your daily needs, delivered with care.</p>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-slate-900 text-sm">Shop</h4>
          <a className="text-sm text-slate-500 hover:text-[#7c3bed] transition-colors" href="/shop">Vegetables &amp; Fruits</a>
          <a className="text-sm text-slate-500 hover:text-[#7c3bed] transition-colors" href="/shop">Dairy &amp; Breakfast</a>
          <a className="text-sm text-slate-500 hover:text-[#7c3bed] transition-colors" href="/shop">Munchies</a>
        </div>

        {/* Help Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-slate-900 text-sm">Help</h4>
          <a className="text-sm text-slate-500 hover:text-[#7c3bed] transition-colors" href="#">Track Order</a>
          <a className="text-sm text-slate-500 hover:text-[#7c3bed] transition-colors" href="#">Customer Support</a>
          <a className="text-sm text-slate-500 hover:text-[#7c3bed] transition-colors" href="#">Returns &amp; Refunds</a>
        </div>

        {/* Get App */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-slate-900 text-sm">Get App</h4>
          <div className="flex gap-2">
            <div className="h-10 bg-slate-900 rounded-lg w-28 flex items-center justify-center gap-1.5 px-3 cursor-pointer hover:bg-slate-800 transition-colors">
              <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
              <div className="text-white">
                <p className="text-[7px] leading-tight">Download on the</p>
                <p className="text-[10px] font-semibold leading-tight">App Store</p>
              </div>
            </div>
            <div className="h-10 bg-slate-900 rounded-lg w-28 flex items-center justify-center gap-1.5 px-3 cursor-pointer hover:bg-slate-800 transition-colors">
              <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.627L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.301 2.301-8.635-8.633z" /></svg>
              <div className="text-white">
                <p className="text-[7px] leading-tight">GET IT ON</p>
                <p className="text-[10px] font-semibold leading-tight">Google Play</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1440px] mx-auto mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
        © 2026 Rotana. All rights reserved.
      </div>
    </footer>
  );
}
