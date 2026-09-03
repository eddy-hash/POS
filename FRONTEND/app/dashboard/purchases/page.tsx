'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCartIcon, PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon, ArrowPathIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import ConfirmModal from '@/components/ConfirmModal';
import SuccessModal from '@/components/SuccessModal';
import { useCurrencySafe } from '@/context/CurrencyContext';


export default function PurchasesPage() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const currency = currencyContext?.currency || 'TZS';
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const data = await api.get(`/purchases?currency=${currency}`, token);
      const arr = Array.isArray(data) ? data : (data?.data || data?.purchases || []);
      setPurchases(arr);
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPurchases(); }, [currency]);

  const handleDelete = (id: number) => { setDeletingId(id); setConfirmOpen(true); };
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

  const filteredPurchases = purchases.filter((p: any) =>
    p.supplier?.toLowerCase().includes(search.toLowerCase()) ||
    p.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  );

  const displayTotal = (purchase: any) => {
    if (purchase.formattedTotalShort) return purchase.formattedTotalShort;
    if (purchase.formattedTotal) return purchase.formattedTotal;
    return formatCurrency(purchase.totalAmount || 0);
  };

  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const completedPurchases = purchases.filter(p => p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'received').length;
  const pendingPurchases = purchases.filter(p => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'ordered').length;

  const fontVars = `  `;

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'received') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (s === 'pending' || s === 'ordered') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (s === 'cancelled' || s === 'voided') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  };

  if (loading) {
    return (
      <div className={` font-sans flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-slate-50 dark:bg-slate-900`}>
        <div className="h-12 w-12 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin" />
        <p className="text-sm tracking-wide text-slate-500 dark:text-slate-400">Loading purchases...</p>
      </div>
    );
  }

  return (
    <>
      <div className={` font-sans min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 sm:p-6 md:p-8`}>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">Purchase Management</p>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-7 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
                <h1 className="font-display font-semibold text-xl sm:text-2xl lg:text-4xl tracking-tight">Purchases</h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Track all your purchase orders and supplier transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchPurchases} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                <ArrowPathIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /><span className="hidden xs:inline">Refresh</span>
              </button>
              <button onClick={() => router.push('/dashboard/purchases/new')} className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md">
                <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /><span>New Purchase</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="p-1.5 sm:p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30"><ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" /></div>
                <div><p className="text-[9px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Purchases</p><p className="font-display text-base sm:text-2xl font-semibold mt-0.5 text-slate-900 dark:text-white">{totalPurchases}</p></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="p-1.5 sm:p-2.5 rounded-lg bg-green-50 dark:bg-green-900/30"><CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" /></div>
                <div><p className="text-[9px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Spent</p><p className="font-display text-[10px] sm:text-2xl font-semibold mt-0.5 truncate text-green-600 dark:text-green-400 max-w-[60px] sm:max-w-full">{formatCurrency(totalSpent)}</p></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="p-1.5 sm:p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30"><TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" /></div>
                <div><p className="text-[9px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p><p className="font-display text-base sm:text-2xl font-semibold mt-0.5 text-slate-900 dark:text-white">{completedPurchases}</p></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="p-1.5 sm:p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/30"><TagIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" /></div>
                <div><p className="text-[9px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending</p><p className="font-display text-base sm:text-2xl font-semibold mt-0.5 text-slate-900 dark:text-white">{pendingPurchases}</p></div>
              </div>
            </div>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search by supplier, order number, or status..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-xs sm:placeholder:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>

          {filteredPurchases.length === 0 ? (
            <div className="text-center py-12 sm:py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="inline-flex p-3 sm:p-4 rounded-full bg-slate-50 dark:bg-slate-700/50"><ShoppingCartIcon className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-500" strokeWidth={1.5} /></div>
              <p className="font-display font-semibold text-base sm:text-lg mt-3 sm:mt-4 text-slate-900 dark:text-white">{search ? 'No matching purchases found' : 'No purchases yet'}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto px-4">{search ? 'Try adjusting your search terms or clear the filter to see all purchases.' : 'Start tracking your purchase orders.'}</p>
              {!search && <button onClick={() => router.push('/dashboard/purchases/new')} className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"><PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Create Your First Purchase</button>}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <div className="col-span-1 hidden sm:block text-center">S/N</div>
                <div className="col-span-2 sm:col-span-2">Order #</div>
                <div className="col-span-3 sm:col-span-3">Supplier</div>
                <div className="col-span-2 text-right hidden sm:block">Total</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {filteredPurchases.map((purchase, i) => (
                <div key={purchase.id} className={`grid grid-cols-12 gap-3 items-center px-4 py-3.5 ${i !== filteredPurchases.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150`}>
                  <div className="col-span-1 hidden sm:block text-center"><span className="font-mono text-xs text-slate-400 dark:text-slate-500 tabular-nums">{String(i + 1).padStart(2, '0')}</span></div>
                  <div className="col-span-2 sm:col-span-2 min-w-0"><p className="font-mono text-sm font-medium truncate text-slate-900 dark:text-white">{purchase.orderNumber || `#${purchase.id}`}</p></div>
                  <div className="col-span-3 sm:col-span-3 min-w-0"><p className="font-serif text-sm truncate text-slate-700 dark:text-slate-300">{purchase.supplier || 'N/A'}</p></div>
                  <div className="col-span-2 text-right hidden sm:block"><span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{displayTotal(purchase)}</span></div>
                  <div className="col-span-2 text-center"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(purchase.status)}`}>{purchase.status || 'Pending'}</span></div>
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button onClick={() => router.push(`/dashboard/purchases/${purchase.id}/edit`)} className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"><PencilIcon className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(purchase.id)} disabled={deletingId === purchase.id} className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"><TrashIcon className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">Showing <span className="font-medium">{filteredPurchases.length}</span> of <span className="font-medium">{purchases.length}</span> purchases</div>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Purchase" message="Are you sure you want to delete this purchase order? This action cannot be undone." confirmText="Delete" cancelText="Cancel" confirmColor="red" />
      <SuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} title={modalTitle} message={modalMessage} buttonText="Continue" onButtonClick={() => setSuccessOpen(false)} />
    </>
  );
}
