'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductImageGallery from './components/ProductImageGallery';
import ProductHeader from './components/ProductHeader';
import PackSizeSelector from './components/PackSizeSelector';
import PricingSlabsTable from './components/PricingSlabsTable';
import MarginCalculator from './components/MarginCalculator';
import ProductInfoCards from './components/ProductInfoCards';
import ProductActionBar from './components/ProductActionBar';
import ProductSpecifications from './components/ProductSpecifications';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PRODUCT_IMAGES = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDCQsAOd-mezMXRaXqPm6XKb8MaCf-kYD-Rfh4pYjb75YeyeY30A3VMTlVM7498oigaUgQvDny2VQZCc8LeSNsaYcBf9HNoxe080BkOYW7Xvd08xj9lqOZEFdi1AVM6KjZT6EjHxc77gemDIt8OHJZJ6P8vzpL8dnzBry838iPinMzJqMext1zZVyRQYmBPVA7goIStLecf5y1Ekas-e6BGd7m7V1OLa4n8TSWGFeHtzwaZiyKTlwrV2mJUwFW8E82sYd3V6KOQZM',
    alt: 'Sack of premium basmati rice 25kg',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLzz9neo_NiPHJcJxIZBXliwoha0svfnVGyGAPi9MzL9RHJcCYt6l1kuMmsFhyYkpzHpiY_a4mD2C8kSoMsh6i6s2x0vLhj0UXfdt2OKWSscPpttFzYFUvwe7qIpUsiI21cjXQ0GaRWNDafD4i9kKCXJrQ2b0rAZBGkQcc_bpSm5DbTd_ckdE7h7dq9dYqeRDk_8cYVKpCztqh09okqwhCL-t-N_RK-kecp7SuMqjepOgIDmMEE8kOFnmP45DwfcTwmYhTcWCceq0',
    alt: 'Main view thumbnail',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVbRU3VyajmpTDQNsiuWRpjp8nKF93C68Q4F815eYGxasA7VPMOPEaI-h1o0txf8ajXNnWuhSZi0gGx45X-ey8kefoBWaaLYE4_rj0E2sxZOgmwNPNKT8-w5dtlBBVqpun_0qgImE70WxcOZ_66jDu97M2J0J1GvgKPXI8ehcyS1u2ef518AptkEU3nxf4bijxcAM3kRB76N2L9cR1I0xxKeVeVoi6uf48FxhY0wBC2Yo6eymVyJv6__5WPJym1Fiyjr4EP3hw_c0',
    alt: 'Rice grain close up',
  },
  {
    src: '',
    alt: 'Product video',
    type: 'video' as const,
  },
];

const PACK_SIZES = [
  { label: '1 kg', value: '1kg' },
  { label: '5 kg', value: '5kg' },
  { label: '25 kg', value: '25kg' },
  { label: '50 kg', value: '50kg' },
];

const PRICING_SLABS = [
  {
    quantityRange: '1 - 5',
    tier: 'Standard',
    tierStyle: 'standard' as const,
    unitPrice: '₹1,850',
    margin: '12%',
  },
  {
    quantityRange: '6 - 20',
    tier: 'Wholesale',
    tierStyle: 'wholesale' as const,
    unitPrice: '₹1,720',
    margin: '18%',
    highlighted: true,
  },
  {
    quantityRange: '21+',
    tier: 'Super Wholesale',
    tierStyle: 'super-wholesale' as const,
    unitPrice: '₹1,650',
    margin: '22%',
  },
];

const PRODUCT_SPECS = [
  { label: 'Grain Type', value: '1121 Steam Basmati' },
  { label: 'Crop Year', value: '2023 - Aged 12 Months' },
  { label: 'Origin', value: 'Punjab, India' },
  { label: 'Packaging', value: 'Jute Bag / PP Bag' },
  { label: 'Moisture', value: '< 12%' },
  { label: 'Broken Ratio', value: '< 1%' },
];

const INFO_ITEMS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
      </svg>
    ),
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'Free Delivery',
    subtitle: 'On orders above 10 bags',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
    iconBg: 'bg-purple-50 text-[#7c3bed]',
    title: 'Credit Available',
    subtitle: 'Buy now, pay in 15 days',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
      </svg>
    ),
    iconBg: 'bg-orange-50 text-orange-600',
    title: 'Quality Assured',
    subtitle: 'Direct from mill sourcing',
  },
];

// ─── Page Component ─────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const [selectedPackSize, setSelectedPackSize] = useState('25kg');
  const [quantity, setQuantity] = useState(10);

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-grow px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-[#706189]">
        <Link href="/" className="transition-colors hover:text-[#7c3bed]">Home</Link>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        <Link href="/shop" className="transition-colors hover:text-[#7c3bed]">Staples</Link>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        <Link href="/shop" className="transition-colors hover:text-[#7c3bed]">Rice &amp; Grains</Link>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        <span className="font-medium text-[#131118]">Premium Basmati</span>
      </nav>

      {/* Product Detail Layout */}
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Left Column: Gallery */}
        <div className="w-full lg:w-5/12">
          <ProductImageGallery images={PRODUCT_IMAGES} badge="Top Seller" />
        </div>

        {/* Right Column: Details */}
        <div className="flex w-full flex-col lg:w-7/12">
          <ProductHeader
            brand="Royal Harvest"
            sku="BAS-25-PREM"
            title="Premium Basmati Rice - Extra Long Grain"
            rating={4.8}
            reviewCount={128}
            inStock={true}
            bulkBuyAvailable={true}
          />

          <PackSizeSelector
            sizes={PACK_SIZES}
            selectedSize={selectedPackSize}
            onSelect={setSelectedPackSize}
          />

          <PricingSlabsTable slabs={PRICING_SLABS} />

          {/* Margin Calculator + Info */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <MarginCalculator mrp={2400} wholesalePrice={1720} />
            <ProductInfoCards items={INFO_ITEMS} />
          </div>

          {/* Action Bar */}
          <ProductActionBar
            quantity={quantity}
            onQuantityChange={setQuantity}
            unitPrice={1720}
          />
        </div>
      </div>

      {/* Product Specifications */}
      <ProductSpecifications specs={PRODUCT_SPECS} />
    </main>
  );
}
