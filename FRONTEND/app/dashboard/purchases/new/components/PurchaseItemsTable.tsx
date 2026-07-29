'use client';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PurchaseItem } from '../types';

interface PurchaseItemsTableProps {
  items: PurchaseItem[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function PurchaseItemsTable({ items, onQuantityChange, onRemoveItem }: PurchaseItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
        <ShoppingCartIcon className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">No products added yet</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Search and add products to start your purchase</p>
      </div>
    );
  }

  // Calculate total quantity
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="overflow-x-auto">
      <div className="mb-3 flex justify-between items-center">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Items: {items.length} | Total Quantity: {totalQuantity}
        </h4>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
            <th className="py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
            <th className="py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">SKU</th>
            <th className="py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
            <th className="py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Qty</th>
            <th className="py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
            <th className="py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {items.map((item, index) => (
            <tr key={item.productId} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
              <td className="py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                {index + 1}
              </td>
              <td className="py-3 text-sm text-slate-900 dark:text-white font-medium">
                {item.productName}
              </td>
              <td className="py-3 text-sm text-slate-500 dark:text-slate-400 text-center hidden sm:table-cell">
                {item.sku || '—'}
              </td>
              <td className="py-3 text-sm text-slate-600 dark:text-slate-300 text-center">
                TZS {item.price.toLocaleString()}
              </td>
              <td className="py-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center justify-center text-sm font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                    className="w-14 px-1 py-1 text-center border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/30 transition flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                TZS {(item.price * item.quantity).toLocaleString()}
              </td>
              <td className="py-3 text-right">
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-red-500 hover:text-red-700 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <td colSpan={4} className="py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">
              Total:
            </td>
            <td className="py-3 text-sm font-bold text-center text-blue-600 dark:text-blue-400">
              {totalQuantity}
            </td>
            <td className="py-3 text-sm font-bold text-right text-emerald-600 dark:text-emerald-400">
              TZS {items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
            </td>
            <td className="py-3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
