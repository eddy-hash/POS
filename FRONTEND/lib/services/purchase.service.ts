import { api } from '@/lib/services/api';

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

export const purchaseService = {
  getAll: async (): Promise<Purchase[]> => {
    const token = localStorage.getItem('access_token');
    const data = await api.get('/purchases', token);
    // Handle both array and object responses
    const purchasesArray = Array.isArray(data) ? data : (data?.data || data?.purchases || []);
    return purchasesArray;
  },

  getOne: async (id: number): Promise<Purchase> => {
    const token = localStorage.getItem('access_token');
    const data = await api.get(`/purchases/${id}`, token);
    return data?.data || data;
  },

  create: async (data: CreatePurchaseDto): Promise<Purchase> => {
    const token = localStorage.getItem('access_token');
    const result = await api.post('/purchases', data, token);
    return result?.data || result;
  },

  delete: async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');
    await api.del(`/purchases/${id}`, token);
  },
};