interface Props {
  form: any;
  error: string;
}

export function ExpenseReview({ form, error }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Description</span>
          <span className="font-medium text-slate-900 dark:text-white">{form.description || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Category</span>
          <span className="font-medium text-slate-900 dark:text-white">{form.category || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Date</span>
          <span className="font-medium text-slate-900 dark:text-white">
            {form.expenseDate ? new Date(form.expenseDate).toLocaleDateString() : '—'}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
          <span className="font-semibold text-slate-900 dark:text-white">Amount</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            TZS {parseFloat(form.amount || '0').toLocaleString()}
          </span>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
