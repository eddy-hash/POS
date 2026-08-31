'use client';

import { useRouter } from 'next/navigation';
import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Sale } from '@/types/sales';

interface SaleActionsProps {
  sale: Sale;
}

export function SaleActions({ sale }: SaleActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this sale?')) {
      // Delete sale
      toast.success('Sale deleted');
      router.push('/sales');
    }
  };

  const handleExport = async () => {
    // Export sale as PDF/CSV
    toast.success('Exporting...');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Actions</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          Export
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 transition"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
