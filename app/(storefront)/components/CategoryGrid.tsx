import Link from 'next/link';

const categories = [
  {
    name: 'Fruits',
    bg: 'bg-orange-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd2WjQ0LNHlIWegGRCWrHE5KLGDOV2bdxUpmMcEgTTEWahC1dVDNEYUBeHQz5sT3Bsyamy0TguczZodYDATzg_4TLBBA5-ZcCveDm9E62OnJS35lH3Iegxzn9HmpmZMzR6AU-MF-itDOrth-2973rNOT5wSmlrOoDu91K57MMvGku0rHsZH8ocFXFTM2nING077tfxarzqgkBCTI7NZEpHwnSCKGvytwTLkVvVcLGN3nnZBLigThA0hQw27osmNFfRZC4VgajFn-k',
  },
  {
    name: 'Vegetables',
    bg: 'bg-green-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq00JEZBZOvd7AtRegu-aBybhcJyUJgb5H3aLhMPreaG15OOX2DKM7_KSV_mDwqmm029jq09qZa798OMfTM15Io8f8xqfvYzc9gY14k92Yd2CRmQM7LG8_bY8OKjh4N87eaaqtvQMvPhm-ffrB3AltsHbdFjjmSO7Cg29z7zJSYamw8TpwIKQEN-vtOWrXgyxqSUWBokN2rj8OmaHh6g4spfBuQrK73m80vWejGSdDB2RfiQoZT2m_3IdczwEW01tfHPibXJ3ejL0',
  },
  {
    name: 'Dairy',
    bg: 'bg-blue-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBs4sKAi9KKc5z-KCfyn5BZ396EbHmRRCodellgkJ_LymQZxmJpAvQV3PBWCWmzFvX_ub51e5smU3dAkgrGAbFG-QvnEAkd4aUvZsKTwU4nT28e9nL5Y4zeEhIwwk19zPkHPGegrSV-0hHLBzJysAL23M5OAF1dLv2XgTyVIZuQ-Uk9IlVi7cZmt40-3WhDqmK44DxEG5Am9tnr_3tQulu0IzNq3-Jhqx9aBap5qe4-WHDfrsYIVHoqhFzYmLfGI1hqD_jHPq-axc',
  },
  {
    name: 'Staples',
    bg: 'bg-yellow-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzPF1rfPr4oGhkhPG-s5yX4YN_v5cNZIok-OAmFo1E512qAjUxh8KXP2eG0fzTx4O6gLod3MQZh1wktOwVSGFhuqVgK5e3LnbiGs4XFR1lO7RIY-nR_HgkuDJ7cx9tcjAeu88VRewfIoz1QmIYRdC2iEX2jcsfLPvIZBKRxFh0EAkeZuimhuP-p_hU0S_qQ42AEinYXb3-_mKK1x8O_9eumGe23_gHeMvn_46Do-9qQ7ujo5z9AKTQoQtkA495HMkrlXx-cLXFe-k',
  },
  {
    name: 'Snacks',
    bg: 'bg-red-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9ly6P3xUtOiDlV8Q68mhdwnST9sszyHAUf_PI1oDfiZikXkZJ6NdVDmT_8M2x5quWtD6IgpCkvvwfy5aimFdIHEu3-B7SQWnEJJ4Xa36ipx6-coT4XAcPbTFxYDC6VNU1rxAR5J3Z2zZ6-OUBj17890mij6x0Ao13-Usn8TChOpNnrLc7qGx4GmSjxt-U7ip2rsJptrHfNmN-4N3Qf8TtwtekxzLW9S79CYUQ696BTpA5D60GdeyiuGmfBZA6_cIRajLg_Ed51NI',
  },
  {
    name: 'Cleaning',
    bg: 'bg-purple-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQidO9I-T4eh3_TZNVgCgGTcBdA2LRV_LsCsxPJuhbMi-JSRwQFzpdpkgjmHyHPX4mUjb_uGk-dh7LcY-fZR5edL5NwMhAPeHXW5lxlhbnaOAcc7_2XrqJT88iavy7FVcc42oNI29J1OqYjdJ-8fltuONEHkxXUSMvlxBLOW1BeypYgWhUpd3zaLpGQp6kLC0TGcJREzWLSaAjN5BNIeEd2VXHp5NZth88NCvBceOyojzWoms7KvO-d_xsX5dT7t-Z5YZlXIl7l1Y',
  },
  {
    name: 'Personal Care',
    bg: 'bg-teal-50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiVnxCXwdLf1ygiCzWpyqsG3kRqT4Kiv88mxXjKzglzQNQkenJ2rGvmPyjsUJ9fVO61JJ95m0Fz4BuyfyojV0eVa722lA53-MHYhRXp-wPO9Qpir0E5KcSysEY6Jh8Mx9tWhVLqe5GNUz9kt0C_BAyskLokd70XQVXtlOUWt0KT-tI-ANzaXnXbjTnPeWCDu-gfF6hnIVCeuPSqv0l_g7mcVpGMLWEl96TcgfQsMMCtUC-sC04lp5dC2HPv421Pw1HrM-bcpbd-Vc',
    hiddenMobile: true,
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
        <Link className="text-[#7c3bed] text-sm font-semibold hover:underline" href="/shop">View All</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            className={`group flex flex-col items-center gap-3 ${cat.hiddenMobile ? 'hidden lg:flex' : ''}`}
            href="/shop"
          >
            <div className={`size-24 sm:size-28 rounded-full ${cat.bg} border border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:shadow-md group-hover:border-[#7c3bed]/30`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={cat.name}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300"
                src={cat.image}
              />
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-[#7c3bed] transition-colors">{cat.name}</span>
          </Link>
        ))}

        {/* More button */}
        <Link className="group hidden lg:flex flex-col items-center gap-3" href="/shop">
          <div className="size-24 sm:size-28 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:shadow-md group-hover:border-[#7c3bed]/30">
            <div className="flex flex-col items-center justify-center h-full w-full bg-slate-100">
              <svg className="text-slate-400 group-hover:text-[#7c3bed] transition-colors" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            </div>
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-[#7c3bed] transition-colors">More</span>
        </Link>
      </div>
    </section>
  );
}
