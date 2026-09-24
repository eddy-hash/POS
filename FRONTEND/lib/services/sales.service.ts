import axios from 'axios';
import { getToken } from '@/lib/auth-token';
import { getAuthToken } from '@/lib/auth';

export interface Sale {
  id: number;
  saleNumber: string;
  customerName?: string;
  netAmount: number;
  totalAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  status?: 'completed' | 'pending' | 'cancelled';
  saleDate: string;
  createdAt?: string;
  updatedAt?: string;
  items?: SaleItem[];
  userId: number;
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export type CreateSaleDto = Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'saleNumber'> & {
  items: Omit<SaleItem, 'id'>[];
};

// ✅ Use relative URL (nginx proxies to backend)
const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const salesService = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get('/sales', getToken());
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
  getOne: async (id: number): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`, getToken());
    return response.data?.data ?? response.data;
  },
  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await api.post('/sales', data, getToken());
    return response.data?.data ?? response.data;
  },
  update: async (id: number, data: Partial<CreateSaleDto>): Promise<Sale> => {
    const response = await api.patch(`/sales/${id}`, data);
    return response.data?.data ?? response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sales/${id}`);
  },
};
