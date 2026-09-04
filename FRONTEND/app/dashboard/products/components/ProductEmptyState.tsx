'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CubeIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProductEmptyStateProps {
  search: string;
}

export function ProductEmptyState({ search }: ProductEmptyStateProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12 sm:py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700"
    >
      <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-700/50">
        <CubeIcon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
      </div>
      <p className="font-display font-semibold text-base sm:text-lg mt-4 text-slate-900 dark:text-white">
        {search ? 'No matching products found' : 'No products yet'}
      </p>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto px-4">
        {search ? 'Try adjusting your search terms.' : 'Start building your product catalog by adding your first product.'}
      </p>
      {!search && (
        <button
          onClick={() => router.push('/dashboard/products/new')}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium shadow-sm active:scale-95 w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-4 w-4" />
          Add Your First Product
        </button>
      )}
    </motion.div>
  );
}
