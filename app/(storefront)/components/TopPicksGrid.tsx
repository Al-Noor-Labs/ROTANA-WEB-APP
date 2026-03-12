import ProductCard, { type Product } from './ProductCard';

const topPicks: Product[] = [
  {
    id: 'organic-mixed-veggies',
    name: 'Organic Mixed Veggies',
    weight: '1kg Pack',
    price: '₹120',
    badge: 'FRESH',
    badgeColor: 'bg-green-500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC05-sZimRK1ANWg9HKKCeg7dzrwzdvEw87qmWcbZr0D4lRwcwP0m1enBWzeSq85WX6IzbJnRW3_A50bhpbrHiKaApyllVrsT4fKUempS8f_N6xxIwq7fWJsASLYenYxvRnfBg-nwWk33lUvtpR1G2NvAN3Kwb-jOeRafoFd0TRun-_V6jWK8xkCoQIRM8yMg-AHF3PWkLjvrYeAT861VJxm9nJzxF03pXFHCGmNwFb_qapHSNaUJEwbwWXnJKaHx4klxa_5eRPFBU',
  },
  {
    id: 'royal-basmati-rice',
    name: 'Royal Basmati Rice',
    weight: '5kg Bag',
    price: '₹450',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH1odzvXmHRCumekGgI1BHm1trflKW2SOVHZAmblf2NpkrkKl7G5FmQwJ5kCU8VWb6SB5iMfGGjI0iyoY9HtSlrv7xIRH9Ssi0erGjg3E_DMN6SWJJL-jrTu42WuV6nLH5pUD__w1b4P6-d7x47RkwuzYUAFWHjf6xmHqrh0lAMWPyRGQNAzYSaT76_hE9RjtYwxzhyLQpAVVH_2dO3FWZ7Mn6hEhJSxTZ1w_7mW1ZeRZNqhi108ujmb4Tz1zdgmGhw61vWullPx4',
  },
  {
    id: 'farm-fresh-milk',
    name: 'Farm Fresh Milk',
    weight: '1L Carton',
    price: '₹65',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMxgE4eY33S74ht9lQb5nLAohbbQlh6pn9ntngavwieV0z5gxF1zZ5_3iGD_TyMORocMXGPY6twoRNPfMg2_lIgCUpr8KnR2f4uHSQQECcz9tFCfMVuum9jn7tZC4ocuOP_sO_S6Vo5k9JN3QK8fv7HyBp-rg5Qn3Qde9M4UZ-aygp9DLoZWmgnaAvTH3R-Yc4i0LHQF96u5XYlaVkuRXmsDRQmKJQ_cXnwkgoBLKg05gEN5ibCMvfsWE8swlPXE8avxnSEGvrV4E',
  },
  {
    id: 'real-orange-juice',
    name: 'Real Orange Juice',
    weight: '1L Bottle',
    price: '₹110',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCESXdTyb6J2ld5AjFCY_ib8CG5x5UacITX4ByzRqVBdvGZoBVNt0HIXfe5mjnVW2P3ZBFOE-3_uS9Vh6W5S883q-0l47HJTgWVMD3aEQ45m4-HWfwAlBtRLN2lYmHLqxM8UlDbzvcfhIyBgtmqGvGz5W0xMz6MCeudEnd0gDc5b_LewRbvlL_XAuDmklyEMOUWX-vMM-iUpoYVMRJ86SUHTSFedxt2JO-iscsY-WlrvhCnJiP2v7owqF0t67prqQcgvt4ho49gvD0',
  },
  {
    id: 'premium-roast-coffee',
    name: 'Premium Roast Coffee',
    weight: '250g Pack',
    price: '₹350',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD8g__XHjad5Gm6EKGR-jE3vAiIMkmbUIQbT3E_Do1ULEVhJns6QD_uWALmNmFZYorxtN6dwjTIocb9pqPH0h_bHA5S4AZc8A8D8QXZX_TqtR7lfSkcDi4BVd2_cZBLN9WcFjMMWC3dNRWDQGmMcKcjZO0gXRX11Iz0NrS1UEjqdZnXrfd2HrSGgmxY7CZ2svOSkQgqDgY4QZUI9wxtuv5WyiCYA_2GgQXmgrV82frzfpQQmYEuXuuG6cdtVF5OItzK4rAT6KHGIo',
  },
  {
    id: 'farm-brown-eggs',
    name: 'Farm Brown Eggs',
    weight: '6 Pack',
    price: '₹60',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWKH4ALCHuKNVLC20FingPLAMczzlaedic3ZaKsu5Cuzh8uwrhIC7TCFFXYF4a9vNEhkqmV6MGqRJdjLjA__epT939SrgieUCXowr5qw_KoATbNpam3CsgJdeddHZZapR2A6HOiS4mXoQ6UPMfo7AaCGgbH8tl6hX2V-ZSXsLLl95GE_i5joKzzXV4qlmZcEX8fec1wDa7xaLZQZU_CvkYV_s175R0kZL1NYmsOtDbftaCgr8zPgIkhlXryfu8rnngd-8lcJMza98',
  },
];

export default function TopPicksGrid() {
  return (
    <div className="lg:col-span-8 flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-slate-900">Top Picks for Your Home</h2>
        <div className="flex gap-2">
          <button className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#7c3bed] hover:text-[#7c3bed] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          </button>
          <button className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#7c3bed] hover:text-[#7c3bed] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {topPicks.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
}
