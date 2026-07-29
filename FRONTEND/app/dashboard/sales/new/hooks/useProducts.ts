import { useState, useEffect } from 'react';
import { showErrorToast } from '@/lib/toast';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      // ✅ Handle both array and object responses
      const productArray = Array.isArray(data) ? data : (data?.data || data?.products || []);
      setProducts(productArray);
    } catch (err: any) {
      showErrorToast(err.message);
      setProducts([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
}