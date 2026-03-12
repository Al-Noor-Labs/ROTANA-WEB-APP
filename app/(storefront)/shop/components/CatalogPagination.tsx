'use client';

import { useState } from 'react';

export default function CatalogPagination({ totalPages }: { totalPages: number }) {
  const [currentPage, setCurrentPage] = useState(1);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    pages.push(2);
    pages.push(3);
    if (totalPages > 4) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="mt-12 flex justify-center">
      <nav className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm border border-gray-100">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="size-9 flex items-center justify-center rounded-lg text-[#706189] hover:bg-gray-50 hover:text-[#7c3bed] transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        {getVisiblePages().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="flex items-center justify-center px-2 text-[#706189]">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page as number)}
              className={`size-9 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${
                currentPage === page
                  ? 'bg-[#7c3bed] text-white'
                  : 'text-[#706189] hover:bg-gray-50 hover:text-[#7c3bed]'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="size-9 flex items-center justify-center rounded-lg text-[#706189] hover:bg-gray-50 hover:text-[#7c3bed] transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
