import axios from 'axios';
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

export const salesService = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
  getOne: async (id: number): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data?.data ?? response.data;
  },
  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await api.post('/sales', data);
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
