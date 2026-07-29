import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import { Product, PurchaseItem } from '../types';

export function usePurchaseForm() {
  const router = useRouter();
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addProduct = (product: Product) => {
    const existing = items.find(item => item.productId === product.id);
    if (existing) {
      setItems(prev =>
        prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      setItems(prev => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku || '',
          price: product.price,
          quantity: 1,
          total: product.price,
        },
      ]);
    }
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const submitPurchase = async () => {
    if (items.length === 0) {
      showErrorToast('Please add at least one product');
      return null;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        supplier,
        notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      };

      await api.post('/purchases', payload, token);
      return true;
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to create purchase');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    items,
    supplier,
    notes,
    submitting,
    totalAmount,
    setSupplier,
    setNotes,
    addProduct,
    removeItem,
    updateQuantity,
    submitPurchase,
  };
}
