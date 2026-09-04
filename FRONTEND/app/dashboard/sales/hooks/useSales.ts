'use client';
import { useState, useEffect, useCallback } from 'react';
import { saleService } from '@/services/sale.service';
import { showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

export function useSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const currencyContext = useCurrencySafe();
  const formatCurrency = currencyContext?.formatCurrency || ((amount: number) => `TZS ${amount.toLocaleString()}`);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await saleService.getAll();
      const salesArray = Array.isArray(data) ? data : (data?.data || data?.sales || data?.items || []);
      setSales(salesArray);
    } catch (err: any) {
      const message = err?.message || 'Failed to load sales';
      setError(message);
      showErrorToast(message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const refetch = fetchSales;

  const filteredSales = sales.filter((sale) =>
    sale.saleNumber?.toLowerCase().includes(search.toLowerCase()) ||
    sale.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + (s.netAmount || 0), 0);
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;

  return {
    sales,
    filteredSales,
    loading,
    error,
    search,
    setSearch,
    refetch,
    totalSales,
    totalRevenue,
    completedSales,
    pendingSales,
    formatCurrency,
  };
}
