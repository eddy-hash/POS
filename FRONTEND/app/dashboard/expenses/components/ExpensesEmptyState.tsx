import { PlusIcon } from '@heroicons/react/24/outline';

interface ExpensesEmptyStateProps {
  search: string;
  onAdd: () => void;
}

export function ExpensesEmptyState({ search, onAdd }: ExpensesEmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
      <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-700/50">
        <PlusIcon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
      </div>
      <p className="font-display font-semibold text-base sm:text-lg mt-4 text-slate-900 dark:text-white">
        {search ? 'No matching expenses found' : 'No expenses yet'}
      </p>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto px-4">
        {search ? 'Try adjusting your search terms.' : 'Start tracking your business expenses.'}
      </p>
      {!search && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium shadow-sm active:scale-95 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-4 w-4" />
          Add Your First Expense
        </button>
      )}
    </div>
  );
}
