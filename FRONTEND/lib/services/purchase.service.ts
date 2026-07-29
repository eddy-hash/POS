import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

export interface Purchase {
  id: number;
  purchaseNumber: string;
  supplierName?: string;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  netAmount: number;
  status?: 'completed' | 'pending' | 'cancelled';
  purchaseDate: string;
  createdAt?: string;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export type CreatePurchaseDto = Omit<Purchase, 'id' | 'createdAt' | 'purchaseNumber'> & {
  items: Omit<PurchaseItem, 'id'>[];
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

const extractData = (response: any): any => {
  if (Array.isArray(response)) return response;
  if (response && response.data && Array.isArray(response.data)) return response.data;
  if (response && response.data && response.data.purchases && Array.isArray(response.data.purchases)) {
    return response.data.purchases;
  }
  if (response && response.purchases && Array.isArray(response.purchases)) return response.purchases;
  if (response && response.success && response.data && Array.isArray(response.data)) return response.data;
  return [];
};

export const purchaseService = {
  getAll: async (): Promise<Purchase[]> => {
    try {
      const response = await api.get('/purchases');
      return extractData(response.data);
    } catch {
      return [];
    }
  },
  getOne: async (id: number): Promise<Purchase> => {
    const response = await api.get(`/purchases/${id}`);
    return response.data?.data ?? response.data;
  },
  create: async (data: CreatePurchaseDto): Promise<Purchase> => {
    const response = await api.post('/purchases', data);
    return response.data?.data ?? response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/purchases/${id}`);
  },
};
