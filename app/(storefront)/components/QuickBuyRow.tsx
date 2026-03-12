const quickBuyItems = [
  {
    name: 'Basmati Rice (5kg)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmtzzdIC--TklATpVMb2r7E2VpZp1M4-XcETqbJglqZx218W_0xfQmRKRCTOWDdM44v-zFks72pf5GWJ0XS_li8EdqPpIc4AF_2VWLTPXQ1x_a9Pd-GunEBFqrlX9Szrmww7PKO1ncFGZDZ9Jdnp0t178BQ34PQ09lAPiuDNeaUMZZ0_uUtU0cEXZ4P0TjPtg9_3DBcEm-0tmO92GF0fP3xOiY2_cTpm9KMTGq0amI74W097ACPfgX_Z0kIeQqRSptTS477MfwwpM',
  },
  {
    name: 'Fresh Milk (1L)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVixKN6GWEOrKO1FaE5Ec7dt0SCGVSiIwnqveyVANX_Z-eC-dx_2gb-4zImXnuwN7LhId8bUiauAASlIWA-wE78_u1yzRvqN6gHKmxtJOY1-wwYFwXg3YgD3BXxsZd7tlj7Atu0qmE_6c1Qj6vKosbTfIQDfcz_xG7Q5jM1eupJBhDHphVf5Ss1hO4ahgOY6sN6t2V47pQALI_9AwQiU7xkOOQ_dHyYjGbvnorzrvgCtDn0gEbBrmWhIiKSZcnvJXEXhM27hpS604',
  },
  {
    name: 'Whole Wheat Bread',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMhUdM6Jc2faZr2Khs6oE0xvypoTcUJwOaxOihtFfn-mNY5qSycPqR2j1oJPPc-8jkuk_wh5kYi_LVhsGWN_CcXRPPT_wnjEx-n_1S-8cS0Zm2e2zf5GXyxTlgErgoYvR76W7gWyiKtgaWFSJocSp9PTXgqz56eT1Rm3YDTwpIwnEH62wKAw5uDW0sklI6VZQgMsxS33AiVlU1gN3yeaVkFPzFQH5SeG1kBBWG2bVBzMISK9cBCETsWoneXIhQcBMakU6fEqAdmp8',
  },
  {
    name: 'Farm Brown Eggs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbYGDv7-eKB5mIb8X-ZG5G-7s2Ssw6hbRAUywE6-EQrSiiTSRb2MEnTinPBDVnEAj0tBLMLvXSkyHMogPC4JSez2zyrxbfzOjIA_aJSJH66_D2b1Jmszqd3oZTxpsVquFdL8XOCXYMl8ruJd5wqeHxx4v2AprhZpAtCXLMxONnXWGje65ghGZJPDk67JTL2VoxqdjrswwTyiH4bypUfD04CrQ8a7_7cCcVmdkjdJFTEhhnkxfbHvpWZfmCS6tUv0aRmRjMyreaLUU',
  },
  {
    name: 'Green Apples (6pc)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhsoJuBnNsFxx57VDG4sq4gF3wdRNkvNwOp-2g9T11g-xhfM1Hlf94U8eAEerCR7pZZOlzJ2WC6PEW9hxAQbQG1QPzidMy1fQhhMyylnlH7Mwx_tFzwG44HoyOUqsBkmnZoWb-iBQixUhDP6OxEAXSV7ZszHQ6HN7QDjJHgdq1De8vMApPnL8_ck6haRXvrve75H2Pm0-HNtFYPS3i64zZMrIB_VR9Xe5396K6wR962X7eRJKDBXGcvgChZAxpSj_kdfxpqmHKkfg',
  },
];

export default function QuickBuyRow() {
  return (
    <section className="w-full mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold text-slate-900">Quick Buy Again</h2>
        <a className="text-[#7c3bed] text-sm font-semibold hover:underline" href="#">See History</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
        {quickBuyItems.map((item) => (
          <div key={item.name} className="min-w-[160px] snap-start bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
            <div className="size-20 rounded-lg bg-[#f7f6f8] mb-1 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
            </div>
            <p className="text-xs font-medium text-slate-700 line-clamp-2">{item.name}</p>
            <button className="w-full mt-auto py-1.5 rounded-lg border border-[#7c3bed] text-[#7c3bed] hover:bg-[#7c3bed] hover:text-white text-xs font-bold transition-colors cursor-pointer">
              Add
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
