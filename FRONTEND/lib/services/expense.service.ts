import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  expenseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export type CreateExpenseDto = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExpenseDto = Partial<CreateExpenseDto>;

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

// Helper to extract array from response and convert amounts to numbers
const extractData = (response: any): any => {
  let data = [];
  
  // If response is already an array, return it
  if (Array.isArray(response)) {
    data = response;
  } 
  // If response has a data property that's an array, return it
  else if (response && response.data && Array.isArray(response.data)) {
    data = response.data;
  } 
  // If response has data.data.expenses structure (nested)
  else if (response && response.data && response.data.expenses && Array.isArray(response.data.expenses)) {
    data = response.data.expenses;
  }
  // If response has expenses property
  else if (response && response.expenses && Array.isArray(response.expenses)) {
    data = response.expenses;
  }
  // If response has success and data properties
  else if (response && response.success && response.data && Array.isArray(response.data)) {
    data = response.data;
  }
  
  // Convert amount to number for each expense
  return data.map((item: any) => ({
    ...item,
    amount: parseFloat(item.amount) || 0,
  }));
};

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    try {
      const response = await api.get('/expenses');
      const extracted = extractData(response.data);
      console.log('🔍 [expenseService] Extracted data:', extracted);
      return Array.isArray(extracted) ? extracted : [];
    } catch (error) {
      console.error('❌ [expenseService] Error fetching expenses:', error);
      return [];
    }
  },
  getOne: async (id: number): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    const data = response.data?.data ?? response.data;
    return {
      ...data,
      amount: parseFloat(data.amount) || 0,
    };
  },
  create: async (data: CreateExpenseDto): Promise<Expense> => {
    const response = await api.post('/expenses', data);
    const result = response.data?.data ?? response.data;
    return {
      ...result,
      amount: parseFloat(result.amount) || 0,
    };
  },
  update: async (id: number, data: UpdateExpenseDto): Promise<Expense> => {
    const response = await api.patch(`/expenses/${id}`, data);
    const result = response.data?.data ?? response.data;
    return {
      ...result,
      amount: parseFloat(result.amount) || 0,
    };
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};
