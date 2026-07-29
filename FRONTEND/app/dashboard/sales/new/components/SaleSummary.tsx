'use client';
import { SaleTotals } from '../types';

interface SaleSummaryProps {
  totals: SaleTotals;
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
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-20">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Sale Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            TZS {totals.subtotal.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Tax ({taxAmount}%)</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            TZS {totals.tax.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Discount</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            -TZS {discountAmount.toLocaleString()}
          </span>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-bold text-slate-900 dark:text-white">Net Total</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              TZS {totals.netAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !hasItems}
        className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Processing...' : 'Complete Sale'}
      </button>
    </div>
  );
}
