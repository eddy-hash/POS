'use client';

import { Sale } from '@/types/sales';

interface SaleReceiptProps {
  sale: Sale;
}

export function SaleReceipt({ sale }: SaleReceiptProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">
        Receipt
      </h3>
      
      <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">Invoice #</p>
        <p className="text-lg font-bold text-slate-900 dark:text-white">{sale.invoice_number}</p>
      </div>

      <div className="space-y-2 py-4 border-b border-slate-200 dark:border-slate-700">
        {sale.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-slate-700 dark:text-slate-300">
              {item.product_name} x {item.quantity}
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              TSh {item.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 py-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
          <span className="text-slate-900 dark:text-white">TSh {sale.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Discount</span>
          <span className="text-red-500">-TSh {sale.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Tax</span>
          <span className="text-slate-900 dark:text-white">TSh {sale.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            TSh {sale.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="text-center border-t border-slate-200 dark:border-slate-700 pt-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Payment Method: {sale.payment_method.replace('_', ' ')}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {new Date(sale.created_at).toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Thank you for your purchase!
        </p>
      </div>
    </div>
  );
}
