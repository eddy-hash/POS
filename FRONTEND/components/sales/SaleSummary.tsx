'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface SaleSummaryProps {
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  taxAmount: number;
  discountAmount: number;
  loading: boolean;
  onSubmit: () => void;
  hasItems: boolean;
}

export function SaleSummary({
  totals,
  taxAmount,
  discountAmount,
  loading,
  onSubmit,
  hasItems,
}: SaleSummaryProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sale Summary</h2>

      <div className="space-y-3 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="text-slate-900 dark:text-white font-medium">
            TSh {totals.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Discount</span>
          <span className="text-red-500 font-medium">
            -TSh {totals.discount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Tax</span>
          <span className="text-slate-900 dark:text-white font-medium">
            TSh {totals.tax.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-between py-4 border-b border-slate-200 dark:border-slate-700">
        <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          TSh {totals.total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={!hasItems || loading}
        className={`
          w-full mt-4 py-3 rounded-lg font-medium transition-all duration-200
          flex items-center justify-center gap-2
          ${
            hasItems && !loading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }
        `}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {loading ? 'Processing...' : 'Complete Sale'}
      </button>

      {!hasItems && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Add at least one item to complete the sale
        </p>
      )}
    </div>
  );
}
