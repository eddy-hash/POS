'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductRowProps {
  product: any;
  index: number;
  onDelete: (id: number) => void;
  formatCurrency: (amount: number) => string;
}

export function ProductRow({ product, index, onDelete, formatCurrency }: ProductRowProps) {
  const router = useRouter();
  const isLowStock = product.quantity <= (product.reorderLevel || 5);

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
        <p className="font-mono text-xs truncate max-w-[80px] sm:max-w-[120px] text-slate-500 dark:text-slate-400">
          {product.sku}
        </p>
      </td>
      <td className="px-3 sm:px-4 py-3">
        <p className="font-serif text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-[180px]">
          {product.name}
        </p>
      </td>
      <td className="px-3 sm:px-4 py-3 text-right hidden sm:table-cell">
        <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
          {product.formattedPriceShort || formatCurrency(product.price || 0)}
        </span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-right">
        <span className={`font-mono text-sm font-semibold whitespace-nowrap ${isLowStock ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          {product.quantity || 0}
        </span>
        {product.reorderLevel && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 hidden xs:inline">
            / {product.reorderLevel}
          </span>
        )}
      </td>
      <td className="px-3 sm:px-4 py-3 text-center hidden sm:table-cell">
        {product.isActive !== false ? (
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckIcon className="h-3 w-3" /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
            <XMarkIcon className="h-3 w-3" /> Inactive
          </span>
        )}
      </td>
      <td className="px-3 sm:px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 sm:gap-1.5">
          <button
            onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
            className="p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            aria-label={`Edit ${product.name}`}
          >
            <PencilIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label={`Delete ${product.name}`}
          >
            <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
