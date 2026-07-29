'use client';

interface PurchaseSummaryProps {
  totalAmount: number;
  itemCount: number;
  onConfirm: () => void;
  submitting: boolean;
}

export function PurchaseSummary({ totalAmount, itemCount, onConfirm, submitting }: PurchaseSummaryProps) {
  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-20">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Purchase Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Total Items</span>
          <span className="font-semibold text-slate-900 dark:text-white">{itemCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Total Amount</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            TZS {totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
      <button
        onClick={onConfirm}
        disabled={submitting || itemCount === 0}
        className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {submitting ? 'Creating...' : 'Create Purchase'}
      </button>
    </div>
  );
}
