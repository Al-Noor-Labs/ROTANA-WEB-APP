'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 lg:px-10 py-3">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-slate-900">
          <div className="size-8 rounded-lg bg-[#7c3bed] flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" /></svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">Rotana</h2>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 ml-4">
          <Link className="text-slate-600 hover:text-[#7c3bed] text-sm font-medium transition-colors" href="/">Home</Link>
          <Link className="text-slate-600 hover:text-[#7c3bed] text-sm font-medium transition-colors" href="#">Categories</Link>
          <Link className="text-[#7c3bed] text-sm font-semibold transition-colors" href="/shop">Shop</Link>
          <Link className="text-slate-600 hover:text-[#7c3bed] text-sm font-medium transition-colors" href="#">Offers</Link>
          <Link className="text-slate-600 hover:text-[#7c3bed] text-sm font-medium transition-colors" href="#">My Orders</Link>
        </nav>
      </div>

      <div className="flex flex-1 justify-end gap-4 md:gap-6">
        {/* Search */}
        <label className="hidden sm:flex flex-col min-w-40 h-10 max-w-64 w-full">
          <div className="flex w-full flex-1 items-center rounded-xl bg-slate-100 focus-within:ring-2 focus-within:ring-[#7c3bed]/50 transition-all">
            <div className="text-slate-500 pl-3 pr-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
            <input className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-500 focus:ring-0 focus:outline-none text-sm py-2 pr-3" placeholder="Search essentials..." />
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href="/shop/cart" className="relative flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-[#7c3bed]/10 hover:text-[#7c3bed] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
          </Link>
          <button className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900 hover:bg-[#7c3bed]/10 hover:text-[#7c3bed] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
        </button>

        {/* User Avatar */}
        <div className="hidden sm:block h-10 w-10 rounded-full bg-gradient-to-br from-[#7c3bed] to-[#e4d4fc] ring-2 ring-white shadow-sm" />
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden z-50">
          <nav className="flex flex-col p-4 gap-1">
            <Link className="text-slate-600 hover:text-[#7c3bed] hover:bg-[#7c3bed]/5 text-sm font-medium px-4 py-3 rounded-lg transition-colors" href="/">Home</Link>
            <Link className="text-slate-600 hover:text-[#7c3bed] hover:bg-[#7c3bed]/5 text-sm font-medium px-4 py-3 rounded-lg transition-colors" href="#">Categories</Link>
            <Link className="text-[#7c3bed] hover:bg-[#7c3bed]/5 text-sm font-semibold px-4 py-3 rounded-lg transition-colors" href="/shop">Shop</Link>
            <Link className="text-slate-600 hover:text-[#7c3bed] hover:bg-[#7c3bed]/5 text-sm font-medium px-4 py-3 rounded-lg transition-colors" href="#">Offers</Link>
            <Link className="text-slate-600 hover:text-[#7c3bed] hover:bg-[#7c3bed]/5 text-sm font-medium px-4 py-3 rounded-lg transition-colors" href="#">My Orders</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
