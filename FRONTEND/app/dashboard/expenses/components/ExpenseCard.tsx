import { PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';

interface ExpenseCardProps {
  expense: any;
  formatCurrency: (amount: number) => string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ExpenseCard({ expense, formatCurrency, onEdit, onDelete }: ExpenseCardProps) {
  const dateToUse = expense.expenseDate || expense.createdAt || new Date().toISOString();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] sm:text-xs font-medium">
              <TagIcon className="h-3 w-3" />
              {expense.category}
            </span>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
              {expense.description || 'No description'}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(expense.amount, true)}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
            {new Date(dateToUse).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => onEdit(expense.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition font-medium active:scale-95"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition font-medium active:scale-95"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
