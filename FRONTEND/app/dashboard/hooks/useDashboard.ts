import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchDashboardStats } from '@/lib/dashboard';
import { showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

export function useDashboard() {
  const router = useRouter();
  const currencyContext = useCurrencySafe();
  const currency = currencyContext?.currency || 'TZS';
  const symbols = (currencyContext as any)?.symbols || {};
  const rates = (currencyContext as any)?.rates || {};

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats(currency);
      setStats(data);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      showErrorToast(error.message || 'Failed to load dashboard');
      if (error.message?.includes('401')) {
        localStorage.removeItem('access_token');
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleCurrencyChange = () => loadDashboard();
    window.addEventListener('currencyChanged', handleCurrencyChange);
    window.addEventListener('refreshDashboard', loadDashboard);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
      window.removeEventListener('refreshDashboard', loadDashboard);
    };
  }, []);

  useEffect(() => {
    if (currency) loadDashboard();
  }, [currency]);

  return {
    loading,
    stats,
    currency,
    symbols,
    rates,
    loadDashboard,
  };
}
