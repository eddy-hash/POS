'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface PurchasesSearchProps {
  search: string;
  setSearch: (value: string) => void;
  totalResults: number;
  totalItems: number;
}

export function PurchasesSearch({ search, setSearch, totalResults, totalItems }: PurchasesSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="relative flex-1">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search by supplier, order number, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-xs sm:placeholder:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{totalResults}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{totalItems}</span> purchases
      </div>
    </div>
  );
}
