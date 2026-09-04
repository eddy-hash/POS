'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusIcon, ArrowPathIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { usePurchases } from './hooks/usePurchases';
import { PurchasesStats } from './components/PurchasesStats';
import { PurchasesSearch } from './components/PurchasesSearch';
import { PurchasesTable } from './components/PurchasesTable';
import { PurchasesEmptyState } from './components/PurchasesEmptyState';
import ConfirmModal from '@/components/ConfirmModal';
import SuccessModal from '@/components/SuccessModal';
import { showErrorToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import { useState } from 'react';

export default function PurchasesPage() {
  const router = useRouter();
  const {
    purchases,
    filteredPurchases,
    loading,
    error,
    search,
    setSearch,
    refetch,
    totalPurchases,
    totalSpent,
    completedPurchases,
    pendingPurchases,
    formatCurrency,
    displayTotal,
    getStatusColor,
  } = usePurchases();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleDeleteRequest = (id: number) => {
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
      await refetch();
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to delete purchase');
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading purchases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button onClick={refetch} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* ─── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <ShoppingCartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Purchases</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Track all your purchase orders and supplier transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/purchases/new')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium shadow-sm active:scale-95"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New Purchase</span>
            </button>
          </div>
        </div>

        {/* ─── Stats ────────────────────────────────────────────── */}
        <PurchasesStats
          totalPurchases={totalPurchases}
          totalSpent={formatCurrency(totalSpent)}
          completedPurchases={completedPurchases}
          pendingPurchases={pendingPurchases}
        />

        {/* ─── Search ────────────────────────────────────────────── */}
        <PurchasesSearch
          search={search}
          setSearch={setSearch}
          totalResults={filteredPurchases.length}
          totalItems={purchases.length}
        />

        {/* ─── Table ────────────────────────────────────────────── */}
        {filteredPurchases.length === 0 ? (
          <PurchasesEmptyState search={search} />
        ) : (
          <PurchasesTable
            purchases={filteredPurchases}
            onDelete={handleDeleteRequest}
            displayTotal={displayTotal}
            getStatusColor={getStatusColor}
          />
        )}
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
        onClose={handleSuccessClose}
        title={modalTitle}
        message={modalMessage}
        buttonText="Continue"
        onButtonClick={handleSuccessClose}
      />
    </>
  );
}
