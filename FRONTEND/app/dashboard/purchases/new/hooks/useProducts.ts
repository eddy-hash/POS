import { useState, useEffect } from 'react';
import { showErrorToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const data = await api.get('/products', token);
      const productArray = Array.isArray(data) ? data : (data?.data || data?.products || []);
      setProducts(productArray);
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts };
}
