import { useState, useEffect, useCallback } from 'react';
import { salesService, Sale, CreateSaleDto } from '@/lib/services/sales.service';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export function useSales(options = { autoFetch: true, limit: 100 }) {
  const { autoFetch = true, limit = 100 } = options;
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, s) => sum + (s.netAmount || 0), 0);
  const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // The interceptor handles auth, so no need to pass token
      const response = await salesService.getAll();
      
      let salesArray: Sale[] = [];
      
      if (Array.isArray(response)) {
        salesArray = response;
      } else if (response && typeof response === 'object') {
        // Try to extract from common patterns
        const resp = response as any;
        if (resp.data && Array.isArray(resp.data)) {
          salesArray = resp.data;
        } else if (resp.sales && Array.isArray(resp.sales)) {
          salesArray = resp.sales;
        } else if (resp.data && resp.data.sales && Array.isArray(resp.data.sales)) {
          salesArray = resp.data.sales;
        } else {
          // Fallback: find first array property
          const possibleArray = Object.values(response).find(v => Array.isArray(v));
          if (possibleArray) salesArray = possibleArray as Sale[];
        }
      }
      
      if (!Array.isArray(salesArray) || salesArray.length === 0) {
        setSales([]);
      } else {
        const sorted = [...salesArray].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setSales(sorted.slice(0, limit));
      }
      setInitialized(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load sales');
      showErrorToast(err.message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const createSale = useCallback(async (data: CreateSaleDto) => {
    setLoading(true);
    setError(null);
    try {
      const newSale = await salesService.create(data);
      setSales(prev => [newSale, ...prev]);
      showSuccessToast('Sale added successfully');
      return newSale;
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
      showErrorToast(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSale = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await salesService.delete(id);
      setSales(prev => prev.filter(s => s.id !== id));
      showSuccessToast('Sale deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete sale');
      showErrorToast(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSaleById = useCallback((id: number) => sales.find(s => s.id === id), [sales]);
  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => { 
    setSales([]); 
    setLoading(false); 
    setError(null); 
    setInitialized(false); 
  }, []);

  useEffect(() => {
    if (autoFetch && !initialized) fetchSales();
  }, [autoFetch, fetchSales, initialized]);

  return {
    sales,
    loading,
    error,
    totalSales,
    totalAmount,
    averageAmount,
    fetchSales,
    createSale,
    deleteSale,
    getSaleById,
    clearError,
    reset,
  };
}