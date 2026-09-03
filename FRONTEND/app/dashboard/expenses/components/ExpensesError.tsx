interface ExpensesErrorProps {
  error: string;
  onRetry: () => void;
}

export function ExpensesError({ error, onRetry }: ExpensesErrorProps) {
  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 text-center">
      <div className="flex justify-center mb-4">
        <span className="text-5xl">⚠️</span>
      </div>
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Error Loading Expenses</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        Retry
      </button>
    </div>
  );
}
