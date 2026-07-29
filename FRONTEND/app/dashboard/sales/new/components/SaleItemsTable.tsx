'use client';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SaleItem } from '../types';

interface SaleItemsTableProps {
  items: SaleItem[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function SaleItemsTable({ items, onQuantityChange, onRemoveItem }: SaleItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
        <ShoppingCartIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">No products added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Sale Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Product</th>
              <th className="py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Price</th>
              <th className="py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Qty</th>
              <th className="py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Total</th>
              <th className="py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item) => (
              <tr key={item.productId}>
                <td className="py-3 text-sm text-slate-900 dark:text-white">{item.productName}</td>
                <td className="py-3 text-sm text-slate-600 dark:text-slate-300 text-center">TZS {item.price}</td>
                <td className="py-3 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </td>
                <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                  TZS {item.total}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <TrashIcon className="h-4 w-4" />
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
