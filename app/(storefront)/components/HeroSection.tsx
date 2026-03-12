import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="w-full mb-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e4d4fc]/40 to-white shadow-sm border border-slate-100">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 p-8 lg:p-12">
          {/* Text Content */}
          <div className="flex flex-col gap-6 flex-1 text-center lg:text-left z-10">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#7c3bed]/10 text-[#7c3bed] text-xs font-bold uppercase tracking-wider">
                Rapid Mode
              </span>
              <h1 className="text-slate-900 text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Fresh Groceries<br />
                <span className="text-[#7c3bed]">Delivered Daily</span>
              </h1>
              <p className="text-slate-600 text-lg max-w-lg mx-auto lg:mx-0">
                Experience premium quality produce and daily essentials delivered straight to your doorstep within hours.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-[#7c3bed] text-white text-base font-bold hover:bg-[#7c3bed]/90 hover:shadow-lg hover:shadow-[#7c3bed]/30 transition-all transform hover:-translate-y-0.5">
                Shop Daily Essentials
                <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full h-64 lg:h-96 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 rounded-full blur-3xl -z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUxsiCOtuF_lNEYEGnZsi4POxoI2-oFweN21-u-jXZxRHOLxZtQAYWfIR4Iv_8y6dtngqD3YocsakNqTsraV11s3gaBcA_UwbY_bdfEJMRoqBDlNy_Yn8n_5C32FpxFCWgpEaXv22Vn4RnvsNMvCi0YsHmLhAjPQDkDv9R4Ihn7KnKHpHnSigUTplmHOSDU2geMEC_Kvhp3xQoqw1dxwUPrOZqjA1CnPG6xQZ_6XVMZBSjuCLuG5GdieyB5kk9D-svWbddWTDf5NY"
              alt="Basket of fresh fruits and vegetables"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
