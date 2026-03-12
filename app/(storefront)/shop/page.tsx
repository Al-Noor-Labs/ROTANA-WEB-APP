'use client';

import { useState } from 'react';
import Link from 'next/link';
import CatalogFilterSidebar from './components/CatalogFilterSidebar';
import CatalogToolbar from './components/CatalogToolbar';
import WholesaleProductCard from './components/WholesaleProductCard';
import type { WholesaleProduct } from './components/WholesaleProductCard';
import CatalogPagination from './components/CatalogPagination';

const WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    id: '1',
    name: 'Aashirvaad Shudh Chakki Whole Wheat Atta',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAII8RO5ITkPNgGNUUCNB9R9wJLFYMJ-PuWzdHRqIidhtC3b9XzkAKIqwvJrouVLYpV9mX0u8Urk1OP-HL9G6_T4rKXEuV_ZZrLmtwhziHBGO66ryqHvFv_ktWC97WrVyfuNvpvZ1U7dQNJvRzRKb8iV1Cx8ewqdVnONTJQenzwbP-X2CNdgqMU5d-KA542giq3YAsxVKRgPv5_zx9-iftJ7mrpwUhu2Pn1lWOyHOJAtG7-nhiJEHb17IRocOz03BTNW9fGLHYwu2w',
    packSize: '10kg Bag',
    margin: '12%',
    mrp: '₹545',
    wholesalePrice: '₹480',
    initialQty: 5,
  },
  {
    id: '2',
    name: 'Fortune Soya Health Refined Soyabean Oil',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwob4JBqn-jnV49yBC_VNulQIU9YSMXwNmAhjNjxPMBV7wr04AkwMJ3OfaMEzEV5xE5DiVkZWxGVHqcUdhvS4GL_f3r78_lQz-FF12Nh_JFZGsqgE0-pfZXkQxLv-jliw0OcUfsPxgmR3L-4DJGDLJJkBArk-DqxvhcUMFhh_lBWp6LKasIR4FjiJ6dbYwk0SvEPgOZGAud2-aaxgNyddVpWGfHYihakR7k9xhQZ5GShrg4Q7voCGUUgVGATLMZYuzGb-IHaAleG0',
    packSize: '15L Tin',
    margin: '8%',
    mrp: '₹2100',
    wholesalePrice: '₹1920',
    initialQty: 2,
  },
  {
    id: '3',
    name: 'Tata Sampann Unpolished Toor Dal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8-tsrSKSX0P0z8FU7Po3ZeWoHRa2-7HQBmnoBTlHqxaZqG8evBj9m8VyI-1otBasRDKsuOPOaVmVPo6ejEAkLGOaiiDkeia_7Slxur98Y93HUrcZPQtKUQVrdQ4TpL3BUSgBTi3C_IRV0kzFhpCQwMxlPZ0w3hUaLMx8kqMql4YSdMsB6MhWaS7qgXhrY578ZqT5Psc5DATcH4tecSiz8uzr8kic0KkWB9t1G9ySstEcNlg-tmw9qvgff5iq5fj8QCutcn6hRC2w',
    packSize: '30kg Bag',
    margin: '15%',
    mrp: '₹4200',
    wholesalePrice: '₹3570',
    initialQty: 10,
  },
  {
    id: '4',
    name: 'India Gate Basmati Rice Dubar',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnPg9Gxk3_Tjno-sWbQWqYxlmRIlp4Y5gCau0nRAOVdgATgXtxeRvs07sZC7G_qMISnVmFvFFVMeguCDnWaQtDzVDUj1jUnfgfG3onGk8BUo6NV9PKwFUT90AmeEhBDECPetRVj_2cUQo-EY79FIMujHSHvcUdr6B-RuzfIVPp4jGxfUDVJKocbM6tgnPVfr4lWALyS5nYpkVnG7M_fub5g5r_FGNsZsjn_PTRTL7tFYg7dTluydzO2_wJDPSW2Otlpiv7WZ_DHNk',
    packSize: '25kg Bag',
    margin: '10%',
    mrp: '₹1950',
    wholesalePrice: '₹1755',
    initialQty: 0,
  },
  {
    id: '5',
    name: 'Everest Turmeric Powder (Haldi)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKuYzuOIPRI_ReYgxgLlUvDQSjwo5ZoXaPggb0MN_t7jb7o7TsdSAEXRI12tFQH_0OAkGi6WRHJ8NmzrtM0EQsqJ3QbuQzRFvUTrk_gQo27ppLUUv3LRbVthlz_IycWRwWb873kvA6CeoXgyQvDLaH1vw_PlwFsMyRtyvO3iflLVpa7Z1tBkUwWfcD-ajlk7JQNXI3VK8VqvgZ066Yz3twhkn3gR6AZ5huviJ-0WTBaWdBZHXCbcLQixZF1aijGCAKQJLDyTe6J5U',
    packSize: '5kg Pack',
    margin: '14%',
    mrp: '₹1250',
    wholesalePrice: '₹1075',
    initialQty: 0,
  },
  {
    id: '6',
    name: 'Madhur Pure & Hygienic Sugar',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhs-jZnHUPbk1tTxxiXitVu9lokgQUwmuxtgIrlBqca0xsp2liv4vq7GKa7F3IfdkkrXx3qYnSAADv36-jy5bbLmqMeZUC__vnMNWB3b_I2Bel75oOg1ql3nvqJk8UEGqGpW7Gx8zTCnRwPIaijuP3Z3qJyqJgUBA4lb_O8Vy0eNA6bgjsCNibmP-n_cv9v2nIwJIuqnZndEXe_qTLOxMOujPXFSjS2YblRk4TxbKPQL6fWHgGRSIJ1VwUgz3tB1PLheAnltKFwWg',
    packSize: '50kg Sack',
    margin: '6%',
    mrp: '₹2400',
    wholesalePrice: '₹2256',
    initialQty: 50,
  },
];

export default function WholesaleCatalogPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col gap-1 mb-8">
        <nav className="flex items-center gap-2 text-sm text-[#706189]">
          <Link href="/" className="hover:text-[#7c3bed]">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/shop" className="hover:text-[#7c3bed]">Staples</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#131118] font-medium">Atta & Flours</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#131118]">Wholesale Pantry Staples</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#706189]">Showing 1-24 of 1,248 products</span>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#7c3bed]/40 transition-colors">
              <span className="text-sm font-medium text-[#131118]">Sort by: Relevance</span>
              <span className="material-symbols-outlined text-[18px] text-[#706189]">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid layout: Sidebar + Products */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block col-span-3">
          <CatalogFilterSidebar isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
        </div>

        {/* Mobile sidebar */}
        <div className="lg:hidden">
          <CatalogFilterSidebar isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
        </div>

        {/* Product Grid */}
        <div className="col-span-12 lg:col-span-9">
          {/* Active Filters Bar */}
          <CatalogToolbar onToggleFilters={() => setFiltersOpen(true)} />

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {WHOLESALE_PRODUCTS.map((product) => (
              <WholesaleProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <CatalogPagination totalPages={10} />
        </div>
      </div>
    </main>
  );
}
