import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  totalItems: number;
}

const itemsPerPageOptions = [5, 10, 20, 50];

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-3 sm:px-6 mt-4 sm:mt-6 rounded-b-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700 dark:text-slate-300">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">
            Showing {startItem} to {endItem} of {totalItems} results
          </span>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2 text-slate-600 dark:text-slate-400">
                  {page}
                </span>
              )
            ))}
          </div>

          {/* Mobile page indicator */}
          <div className="sm:hidden px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
            {currentPage} / {totalPages}
          </div>

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile items info */}
      <div className="sm:hidden mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
    </div>
  );
}