import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/lib/toast';

interface ReportStats {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCustomers: number;
  totalProducts: number;
  profit: number;
  salesTrend: { date: string; amount: number }[];
  expenseTrend: { date: string; amount: number }[];
  topProducts: { name: string; sales: number }[];
  recentSales: any[];
  recentExpenses: any[];
  lowStockItems: any[];
  monthlyStats: { month: string; revenue: number; expenses: number; profit: number }[];
}

const defaultStats: ReportStats = {
  totalSales: 0,
  totalRevenue: 0,
  totalExpenses: 0,
  totalCustomers: 0,
  totalProducts: 0,
  profit: 0,
  salesTrend: [],
  expenseTrend: [],
  topProducts: [],
  recentSales: [],
  recentExpenses: [],
  lowStockItems: [],
  monthlyStats: [],
};

export function useReports(dateRange: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats>(defaultStats);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/');
        return;
      }
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/reports/stats?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      const reportData = data.data || data;
      setStats({
        totalSales: reportData.totalSales || 0,
        totalRevenue: reportData.totalRevenue || 0,
        totalExpenses: reportData.totalExpenses || 0,
        totalCustomers: reportData.totalCustomers || 0,
        totalProducts: reportData.totalProducts || 0,
        profit: (reportData.totalRevenue || 0) - (reportData.totalExpenses || 0),
        salesTrend: reportData.salesTrend || [],
        expenseTrend: reportData.expenseTrend || [],
        topProducts: reportData.topProducts || [],
        recentSales: reportData.recentSales || [],
        recentExpenses: reportData.recentExpenses || [],
        lowStockItems: reportData.lowStockItems || [],
        monthlyStats: reportData.monthlyStats || [],
      });
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  return { stats, loading, refetch: fetchReports };
}
