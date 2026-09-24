'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PurchasesRowProps {
  purchase: any;
  index: number;
  onDelete: (id: number) => void;
  displayTotal: (purchase: any) => string;
  getStatusColor: (status: string) => string;
}

export function PurchasesRow({ purchase, index, onDelete, displayTotal, getStatusColor }: PurchasesRowProps) {
  const router = useRouter();

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
    >
      <td className="px-3 sm:px-4 py-3 text-xs font-mono text-slate-400 dark:text-slate-500">
        {String(index + 1).padStart(2, '0')}
      </td>
      <td className="px-3 sm:px-4 py-3">
        <p className="font-mono text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
          {purchase.orderNumber || `#${purchase.id}`}
        </p>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <p className="font-serif text-sm truncate text-slate-700 dark:text-slate-300 max-w-[120px]">
          {purchase.supplier || 'N/A'}
        </p>
      </td>
      <td className="px-3 sm:px-4 py-3 text-right hidden sm:table-cell">
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
          {displayTotal(purchase)}
        </span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(purchase.status)}`}>
          {purchase.status || 'Pending'}
        </span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
          <button
            onClick={() => router.push(`/dashboard/purchases/${purchase.id}/edit`)}
            className="p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-label={`Edit purchase ${purchase.orderNumber}`}
          >
            <PencilIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => onDelete(purchase.id)}
            className="p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label={`Delete purchase ${purchase.orderNumber}`}
          >
            <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
