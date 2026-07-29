import axios from 'axios';
import { getAuthToken } from './auth';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

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

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/expenses');
    console.log('🔍 [getExpenses] Full response:', response.data);
    
    // Try multiple ways to extract the array
    let data = response.data;
    
    // If the response has a 'data' property, use it
    if (data && typeof data === 'object' && 'data' in data) {
      data = data.data;
    }
    // If it has a 'success' property and 'data', use that
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      data = data.data;
    }
    // If it's still an object but not an array, try to find the first array property
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const possibleArray = Object.values(data).find(v => Array.isArray(v));
      if (possibleArray) {
        data = possibleArray;
      }
    }
    
    console.log('🔍 [getExpenses] Extracted data:', data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ [getExpenses] Error:', error);
    return [];
  }
};

export const createExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const response = await api.post('/expenses', expense);
  return response.data?.data ?? response.data;
};

export const updateExpense = async (id: number, expense: Partial<Expense>): Promise<Expense> => {
  const response = await api.patch(`/expenses/${id}`, expense);
  return response.data?.data ?? response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};
