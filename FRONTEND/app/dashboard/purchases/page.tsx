'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { showErrorToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import ConfirmModal from '@/components/ConfirmModal';
import SuccessModal from '@/components/SuccessModal';

export default function PurchasesPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const data = await api.get('/purchases', token);
      const arr = Array.isArray(data) ? data : (data?.data || data?.purchases || []);
      setPurchases(arr);
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const token = localStorage.getItem('access_token');
      await api.del(`/purchases/${deletingId}`, token);
      setModalTitle('Purchase Deleted');
      setModalMessage('Purchase order has been deleted successfully.');
      setSuccessOpen(true);
      fetchPurchases();
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to delete purchase');
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Dynamic color functions
  const getTotalColor = (amount: number) => {
    if (amount >= 1000000) return 'text-emerald-600 dark:text-emerald-400';
    if (amount >= 500000) return 'text-blue-600 dark:text-blue-400';
    if (amount >= 100000) return 'text-indigo-600 dark:text-indigo-400';
    if (amount >= 50000) return 'text-purple-600 dark:text-purple-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getSupplierColor = (name: string) => {
    if (!name || name === 'N/A') return 'text-slate-400 dark:text-slate-500';
    const length = name.length;
    if (length > 20) return 'text-teal-600 dark:text-teal-400';
    if (length > 10) return 'text-indigo-600 dark:text-indigo-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getIdBadgeColor = (id: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    ];
    return colors[id % colors.length];
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'received') {
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
    if (s === 'pending' || s === 'ordered') {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
    if (s === 'cancelled' || s === 'voided') {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 dark:bg-slate-900 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Purchases</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track all your purchase orders</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/purchases/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/25"
        >
          <PlusIcon className="h-5 w-5" /> New Purchase
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:!bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Notes</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {purchases.map((purchase: any) => (
              <tr key={purchase.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition duration-200">
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIdBadgeColor(purchase.id)}`}>
                    {purchase.orderNumber || `#${purchase.id}`}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <span className={getSupplierColor(purchase.supplier)}>
                    {purchase.supplier || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">
                  {purchase.notes ? (
                    <span className="italic">{purchase.notes}</span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-right">
                  <span className={getTotalColor(purchase.totalAmount)}>
                    TZS {purchase.totalAmount?.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                  {new Date(purchase.createdAt || purchase.orderDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                    {purchase.status || 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(purchase.id)}
                    disabled={deletingId === purchase.id}
                    className="text-red-500 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>No purchases found</span>
                    <button
                      onClick={() => router.push('/dashboard/purchases/new')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Create your first purchase
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Purchase"
        message="Are you sure you want to delete this purchase order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />

      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={modalTitle}
        message={modalMessage}
        buttonText="Continue"
        onButtonClick={() => setSuccessOpen(false)}
      />
    </div>
  );
}
