'use client';

import { Sale } from '@/types/sales';

interface SaleDetailsProps {
  sale: Sale;
}

export function SaleDetails({ sale }: SaleDetailsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Sale Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Invoice Number</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{sale.invoice_number}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
          <p className="text-sm font-medium">
            <span className={`px-2 py-1 rounded-full text-xs ${
              sale.status === 'completed' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : sale.status === 'cancelled'
                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
            }`}>
              {sale.status}
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Customer</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {sale.customer_phone || 'Walk-in customer'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Payment Method</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
            {sale.payment_method.replace('_', ' ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {new Date(sale.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Amount</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            TSh {sale.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
