import { api } from './services/api';

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCustomers: number;
  totalProducts: number;
  totalPurchases?: number;
  profit: number;
  recentSales: any[];
  recentExpenses: any[];
  lowStockItems: any[];
  topProducts: any[];
  salesTrend: any[];
  expenseTrend: any[];
  formatted?: {
    totalRevenue: string;
    totalExpenses: string;
    profit: string;
  };
  formattedFull?: {
    totalRevenue: string;
    totalExpenses: string;
    profit: string;
  };
  displayCurrency?: string;
  symbol?: string;
}

export const fetchDashboardStats = async (currency?: string): Promise<DashboardStats> => {
  try {
    const url = currency ? `/dashboard/stats?currency=${currency}` : '/dashboard/stats';
    const response = await api.get(url);
    
    // ✅ Extract data from nested response structure
    const data = response.data || response;
    
    const topProducts = data.topProducts || [];
    
    return {
      totalSales: data.totalSales || 0,
      totalRevenue: data.totalRevenue || 0,
      totalExpenses: data.totalExpenses || 0,
      totalCustomers: data.totalCustomers || 0,
      totalProducts: data.totalProducts || 0,
      totalPurchases: data.totalPurchases || 0,
      profit: data.profit || 0,
      recentSales: data.recentSales || [],
      recentExpenses: data.recentExpenses || [],
      lowStockItems: data.lowStockItems || [],
      topProducts: topProducts,
      salesTrend: data.salesTrend || [],
      expenseTrend: data.expenseTrend || [],
      formatted: data.formatted || undefined,
      formattedFull: data.formattedFull || undefined,
      displayCurrency: data.displayCurrency,
      symbol: data.symbol,
    };
  } catch (error: any) {
    console.error('❌ Error fetching dashboard stats:', error);
    
    if (error.message?.includes('401') || error.message?.includes('403')) {
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    
    throw new Error(error.message || 'Failed to fetch dashboard stats');
  }
};
