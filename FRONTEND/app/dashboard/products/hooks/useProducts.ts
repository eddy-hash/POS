'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/lib/services/api';
import { showErrorToast } from '@/lib/toast';
import { useCurrencySafe } from '@/context/CurrencyContext';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  costPrice?: number;
  quantity: number;
  reorderLevel?: number;
  description?: string;
  categoryId?: number;
  category?: { id: number; name: string };
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  formattedPrice?: string;
  formattedPriceShort?: string;
  displayCurrency?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const currencyContext = useCurrencySafe();
  const currency = currencyContext?.currency || 'TZS';

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      const data = await api.get(`/products?currency=${currency}`, token);
      const productsArray = Array.isArray(data) ? data : (data?.data || data?.products || []);
      setProducts(productsArray);
    } catch (err: any) {
      const message = err?.message || 'Failed to load products';
      setError(message);
      showErrorToast(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = fetchProducts;

  // ─── Extract categories ─────────────────────────────────────────
  const categories = useMemo(() => {
    const catMap = new Map<number, string>();
    products.forEach(p => {
      if (p.categoryId && p.category?.name) {
        catMap.set(p.categoryId, p.category.name);
      }
    });
    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // ─── Filter products by category and search ─────────────────────
  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== null) {
      const cat = categories.find(c => c.name === selectedCategory);
      if (cat) {
        result = result.filter(p => p.categoryId === cat.id);
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, selectedCategory, search, categories]);

  // ─── Stats ──────────────────────────────────────────────────────
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const lowStockItems = products.filter(p => (p.quantity || 0) <= (p.reorderLevel || 5)).length;
  const activeProducts = products.filter(p => p.isActive !== false).length;

  // ─── Navigation ────────────────────────────────────────────────
  const categoryNames = useMemo(() => ['All', ...categories.map(c => c.name)], [categories]);

  const currentCategoryIndex = useMemo(() => {
    if (selectedCategory === null) return 0;
    const idx = categoryNames.indexOf(selectedCategory);
    return idx === -1 ? 0 : idx;
  }, [selectedCategory, categoryNames]);

  const goToNextCategory = () => {
    const next = (currentCategoryIndex + 1) % categoryNames.length;
    setSelectedCategory(categoryNames[next] === 'All' ? null : categoryNames[next]);
  };

  const goToPrevCategory = () => {
    const prev = (currentCategoryIndex - 1 + categoryNames.length) % categoryNames.length;
    setSelectedCategory(categoryNames[prev] === 'All' ? null : categoryNames[prev]);
  };

  const goToCategory = (name: string) => {
    setSelectedCategory(name === 'All' ? null : name);
  };

  return {
    products,
    filteredProducts,
    loading,
    error,
    search,
    setSearch,
    refetch,
    totalProducts,
    totalStock,
    lowStockItems,
    activeProducts,
    currency,
    categories,
    selectedCategory,
    currentCategoryIndex,
    categoryNames,
    goToNextCategory,
    goToPrevCategory,
    goToCategory,
  };
}
