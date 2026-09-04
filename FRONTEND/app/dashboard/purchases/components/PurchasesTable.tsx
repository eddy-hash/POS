'use client';
import { motion } from 'framer-motion';
import { PurchasesRow } from './PurchasesRow';

interface PurchasesTableProps {
  purchases: any[];
  onDelete: (id: number) => void;
  displayTotal: (purchase: any) => string;
  getStatusColor: (status: string) => string;
}

export function PurchasesTable({ purchases, onDelete, displayTotal, getStatusColor }: PurchasesTableProps) {
  if (purchases.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[40px] sm:w-[60px]">
                #
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[120px] sm:w-[140px]">
                Order #
              </th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Supplier
              </th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell w-[120px]">
                Total
              </th>
              <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[100px]">
                Status
              </th>
              <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[80px] sm:w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {purchases.map((purchase, i) => (
              <PurchasesRow
                key={purchase.id}
                purchase={purchase}
                index={i}
                onDelete={onDelete}
                displayTotal={displayTotal}
                getStatusColor={getStatusColor}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
