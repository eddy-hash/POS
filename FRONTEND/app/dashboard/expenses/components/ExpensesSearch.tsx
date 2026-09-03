import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ExpensesSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export function ExpensesSearch({ search, setSearch }: ExpensesSearchProps) {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        placeholder="Search by category or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
    </div>
  );
}
