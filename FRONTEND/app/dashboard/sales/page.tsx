'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { showErrorToast } from '@/lib/toast';
import { saleService } from '@/services/sale.service';
import SuccessModal from '@/components/SuccessModal';
import ConfirmModal from '@/components/ConfirmModal';

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await saleService.getAll();
      const salesArray = Array.isArray(data) ? data : (data?.data || data?.sales || data?.items || []);
      setSales(salesArray);
    } catch (err: any) {
      showErrorToast(err.message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await saleService.delete(id);
      setModalTitle('Sale Deleted');
      setModalMessage('The sale has been deleted successfully.');
      setModalOpen(true);
      await fetchSales();
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to delete sale');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const requestDelete = (id: number) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (confirmTargetId !== null) {
      handleDelete(confirmTargetId);
    }
    setConfirmOpen(false);
    setConfirmTargetId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales</h1>
        <button
          onClick={() => router.push('/dashboard/sales/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" /> New Sale
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Sale #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Customer</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Total</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No sales found. Create your first sale!
                </td>
              </tr>
            ) : (
              sales.map((sale: any) => (
                <tr key={sale.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{sale.saleNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{sale.customerName || 'Walk-in'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">
                    TZS {sale.netAmount?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => requestDelete(sale.id)}
                      disabled={deletingId === sale.id}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />

      <SuccessModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        buttonText="Continue"
        onButtonClick={handleModalClose}
      />
    </div>
  );
}
