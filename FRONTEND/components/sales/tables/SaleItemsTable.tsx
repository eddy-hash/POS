'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { SaleItem } from '@/types/sales';

interface SaleItemsTableProps {
  items: SaleItem[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function SaleItemsTable({ items, onQuantityChange, onRemoveItem }: SaleItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No items added yet</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Search and add products above</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                  {item.product_name}
                </td>
                <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-300">
                  TSh {item.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium text-slate-900 dark:text-white">
                  TSh {item.total.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
