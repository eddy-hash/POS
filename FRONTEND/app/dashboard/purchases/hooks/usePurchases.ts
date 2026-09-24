'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/services/api';
import { showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

export function usePurchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);
  const currency = currencyContext?.currency || 'TZS';

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      const data = await api.get(`/purchases?currency=${currency}`, token);
      const arr = Array.isArray(data) ? data : (data?.data || data?.purchases || []);
      setPurchases(arr);
    } catch (err: any) {
      const message = err?.message || 'Failed to load purchases';
      setError(message);
      const status = (err as any)?.status ?? Number(err?.message?.match(/\d+/)?.[0]);
      if (status === 401 || status === 403) { setPurchases([]); return; }
      showErrorToast(message);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const refetch = fetchPurchases;

  const filteredPurchases = purchases.filter((p) =>
    p.supplier?.toLowerCase().includes(search.toLowerCase()) ||
    p.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const completedPurchases = purchases.filter(p => p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'received').length;
  const pendingPurchases = purchases.filter(p => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'ordered').length;

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'received') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (s === 'pending' || s === 'ordered') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (s === 'cancelled' || s === 'voided') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';
  };

  const displayTotal = (purchase: any) => {
    if (purchase.formattedTotalShort) return purchase.formattedTotalShort;
    if (purchase.formattedTotal) return purchase.formattedTotal;
    return formatCurrency(purchase.totalAmount || 0);
  };

  return {
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
  };
}
