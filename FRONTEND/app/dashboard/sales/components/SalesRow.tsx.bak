'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SalesRowProps {
  sale: any;
  index: number;
  onDelete: (id: number) => void;
  formatCurrency: (amount: number) => string;
}

export function SalesRow({ sale, index, onDelete, formatCurrency }: SalesRowProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    const s = status.toLowerCase();
    if (s === 'completed') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (s === 'cancelled') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  };

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
        <p className="font-serif text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
          {sale.saleNumber}
        </p>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <p className="font-serif text-sm truncate text-slate-700 dark:text-slate-300 max-w-[120px]">
          {sale.customerName || 'Walk-in'}
        </p>
      </td>
      <td className="px-3 sm:px-4 py-3 text-right hidden sm:table-cell">
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
          {formatCurrency(sale.netAmount || 0)}
        </span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(sale.status)}`}>
          {sale.status || 'Pending'}
        </span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
          <button
            onClick={() => router.push(`/dashboard/sales/${sale.id}/edit`)}
            className="p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-label={`Edit sale ${sale.saleNumber}`}
          >
            <PencilIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => onDelete(sale.id)}
            className="p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label={`Delete sale ${sale.saleNumber}`}
          >
            <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
