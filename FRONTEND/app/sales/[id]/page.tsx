'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PrinterIcon, ShareIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useSale } from '@/hooks/sales/useSale';
import { SaleDetails } from '@/components/sales/SaleDetails';
import { SaleReceipt } from '@/components/sales/SaleReceipt';
import { SaleActions } from '@/components/sales/SaleActions';

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { sale, loading, error } = useSale(id);

  if (loading) {
    return <div className="p-8 text-center">Loading sale details...</div>;
  }

  if (error || !sale) {
    return <div className="p-8 text-center text-red-500">Sale not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sale #{sale.invoice_number}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {new Date(sale.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <PrinterIcon className="h-5 w-5" />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <ShareIcon className="h-5 w-5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SaleDetails sale={sale} />
          <SaleActions sale={sale} />
        </div>
        <div className="lg:col-span-1">
          <SaleReceipt sale={sale} />
        </div>
      </div>
    </div>
  );
}
