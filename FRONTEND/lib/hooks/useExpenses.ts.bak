import { useState, useEffect, useCallback } from 'react';
import { expenseService, Expense, CreateExpenseDto, UpdateExpenseDto } from '@/lib/services/expense.service';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface UseExpensesOptions {
  autoFetch?: boolean;
  limit?: number;
}

export function useExpenses(options: UseExpensesOptions = {}) {
  const { autoFetch = true, limit = 100 } = options;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Calculate totals from the expenses array - ensure all amounts are numbers
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, e) => {
    const amount = typeof e.amount === 'number' ? e.amount : parseFloat(e.amount as any) || 0;
    return sum + amount;
  }, 0);
  const categoryCount = new Set(expenses.map(e => e.category)).size;
  const averageAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getAll();
      console.log('🔍 [useExpenses] Raw data from service:', data);
      
      let expensesArray: Expense[] = [];
      
      // Handle different response formats
      if (Array.isArray(data)) {
        expensesArray = data;
      } else if (data && typeof data === 'object') {
        // Check for nested data structures
        if (data.data && data.data.expenses && Array.isArray(data.data.expenses)) {
          expensesArray = data.data.expenses;
        } else if (data.data && Array.isArray(data.data)) {
          expensesArray = data.data;
        } else if (data.expenses && Array.isArray(data.expenses)) {
          expensesArray = data.expenses;
        } else {
          // Fallback: find any array property
          const possibleArray = Object.values(data).find(v => Array.isArray(v));
          if (possibleArray) {
            expensesArray = possibleArray;
          } else {
            console.warn('⚠️ [useExpenses] No array found in response:', data);
          }
        }
      }
      
      // Ensure all amounts are numbers
      expensesArray = expensesArray.map((item: any) => ({
        ...item,
        amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0,
      }));
      
      if (!Array.isArray(expensesArray)) {
        console.warn('⚠️ [useExpenses] No array found, setting empty array');
        expensesArray = [];
      }
      
      console.log('🔍 [useExpenses] Extracted array:', expensesArray);
      
      // Sort by date (newest first)
      const sorted = expensesArray.sort((a, b) => {
        const dateA = a.expenseDate ? new Date(a.expenseDate).getTime() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.expenseDate ? new Date(b.expenseDate).getTime() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setExpenses(sorted.slice(0, limit));
      setInitialized(true);
    } catch (err: any) {
      console.error('❌ [useExpenses] Error:', err);
      setError(err.message || 'Failed to load expenses');
      showErrorToast(err.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const createExpense = useCallback(async (data: CreateExpenseDto) => {
    setLoading(true);
    setError(null);
    try {
      const newExpense = await expenseService.create(data);
      setExpenses(prev => [newExpense, ...prev]);
      showSuccessToast('Expense added successfully');
      return newExpense;
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
      showErrorToast(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExpense = useCallback(async (id: number, data: UpdateExpenseDto) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await expenseService.update(id, data);
      setExpenses(prev => prev.map(e => e.id === id ? updated : e));
      showSuccessToast('Expense updated successfully');
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
      showErrorToast(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      showSuccessToast('Expense deleted successfully');
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete expense');
      showErrorToast(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpenseById = useCallback((id: number) => expenses.find(e => e.id === id), [expenses]);
  const getExpensesByCategory = useCallback((category: string) => expenses.filter(e => e.category.toLowerCase() === category.toLowerCase()), [expenses]);
  const getExpensesByDateRange = useCallback((start: Date, end: Date) => expenses.filter(e => { 
    const date = new Date(e.expenseDate || e.createdAt || new Date());
    return date >= start && date <= end; 
  }), [expenses]);
  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => { setExpenses([]); setLoading(false); setError(null); setInitialized(false); }, []);

  useEffect(() => {
    if (autoFetch && !initialized) fetchExpenses();
  }, [autoFetch, fetchExpenses, initialized]);

  return {
    expenses,
    loading,
    error,
    totalExpenses,
    totalAmount,
    categoryCount,
    averageAmount,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getExpensesByCategory,
    getExpensesByDateRange,
    clearError,
    reset,
  };
}
