import axios from 'axios';
import { getAuthToken } from './auth';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number | string;
  costPrice?: number | string;
  quantity: number;
  categoryId?: number;
  category?: Category;
  description?: string;
  image?: string;
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

// Helper to extract array from response
const extractData = (response: any): any => {
  // If response is already an array, return it
  if (Array.isArray(response)) {
    return response.map((item: any) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      costPrice: item.costPrice ? parseFloat(item.costPrice) : null,
    }));
  }
  
  // If response has a data property that's an array
  if (response && response.data && Array.isArray(response.data)) {
    return response.data.map((item: any) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      costPrice: item.costPrice ? parseFloat(item.costPrice) : null,
    }));
  }
  
  // If response has data.products structure (nested)
  if (response && response.data && response.data.products && Array.isArray(response.data.products)) {
    return response.data.products.map((item: any) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      costPrice: item.costPrice ? parseFloat(item.costPrice) : null,
    }));
  }
  
  // If response has products property
  if (response && response.products && Array.isArray(response.products)) {
    return response.products.map((item: any) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      costPrice: item.costPrice ? parseFloat(item.costPrice) : null,
    }));
  }
  
  // If response has success and data properties
  if (response && response.success && response.data && Array.isArray(response.data)) {
    return response.data.map((item: any) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      costPrice: item.costPrice ? parseFloat(item.costPrice) : null,
    }));
  }
  
  // Fallback: return empty array
  return [];
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products');
    return extractData(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categories');
    // Simple extraction for categories
    let data = response.data?.data ?? response.data;
    if (data && data.categories && Array.isArray(data.categories)) {
      data = data.categories;
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', product);
  const data = response.data?.data ?? response.data;
  return {
    ...data,
    price: parseFloat(data.price) || 0,
    costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
  };
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await api.patch(`/products/${id}`, product);
  const data = response.data?.data ?? response.data;
  return {
    ...data,
    price: parseFloat(data.price) || 0,
    costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
  };
};
