import { api } from '@/lib/services/api';

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

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    const token = localStorage.getItem('access_token');
    const data = await api.get('/expenses', token);
    const expensesArray = Array.isArray(data) ? data : (data?.data || data?.expenses || []);
    return expensesArray.map((item: any) => ({
      ...item,
      amount: parseFloat(item.amount) || 0,
    }));
  },

  getOne: async (id: number): Promise<Expense> => {
    const token = localStorage.getItem('access_token');
    const data = await api.get(`/expenses/${id}`, token);
    const result = data?.data || data;
    return {
      ...result,
      amount: parseFloat(result.amount) || 0,
    };
  },

  create: async (data: CreateExpenseDto): Promise<Expense> => {
    const token = localStorage.getItem('access_token');
    const result = await api.post('/expenses', data, token);
    const expense = result?.data || result;
    return {
      ...expense,
      amount: parseFloat(expense.amount) || 0,
    };
  },

  update: async (id: number, data: UpdateExpenseDto): Promise<Expense> => {
    const token = localStorage.getItem('access_token');
    const result = await api.put(`/expenses/${id}`, data, token);
    const expense = result?.data || result;
    return {
      ...expense,
      amount: parseFloat(expense.amount) || 0,
    };
  },

  delete: async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');
    await api.del(`/expenses/${id}`, token);
  },
};
