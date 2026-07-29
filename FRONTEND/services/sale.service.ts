import { api } from '@/lib/services/api';

// Helper to get token from localStorage (or you can pass it)
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const saleService = {
  getAll: () => api.get('/sales', getToken()),
  getById: (id: number) => api.get(`/sales/${id}`, getToken()),
  create: (data: any) => api.post('/sales', data, getToken()),
  update: (id: number, data: any) => api.put(`/sales/${id}`, data, getToken()),
  delete: (id: number) => api.del(`/sales/${id}`, getToken()),
};
