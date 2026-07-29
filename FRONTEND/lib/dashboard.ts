import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCustomers: number;
  totalProducts: number;
  totalPurchases?: number;
  recentSales: any[];
  recentExpenses: any[];
  lowStockItems: any[];
  topProducts: any[];
  salesTrend: any[];
  expenseTrend: any[];
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/dashboard/stats');
    console.log('📊 Dashboard response:', response.data);
    
    let data = response.data;
    if (data && data.data) {
      data = data.data;
    }
    
    // Ensure topProducts is always an array
    const topProducts = data.topProducts || [];
    console.log('📊 Top Products:', topProducts);
    
    return {
      totalSales: data.totalSales || 0,
      totalRevenue: data.totalRevenue || 0,
      totalExpenses: data.totalExpenses || 0,
      totalCustomers: data.totalCustomers || 0,
      totalProducts: data.totalProducts || 0,
      totalPurchases: data.totalPurchases || 0,
      recentSales: data.recentSales || [],
      recentExpenses: data.recentExpenses || [],
      lowStockItems: data.lowStockItems || [],
      topProducts: topProducts,
      salesTrend: data.salesTrend || [],
      expenseTrend: data.expenseTrend || [],
    };
  } catch (error: any) {
    console.error('❌ Error fetching dashboard stats:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dashboard stats');
  }
};
