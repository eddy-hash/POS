import { useState, useMemo } from 'react';
import { showErrorToast } from '@/lib/toast';
import { Product, SaleItem, SaleFormData, SaleTotals } from '../types';

export function useSaleForm() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const addProduct = (product: Product) => {
    
    const price = typeof product.price === 'number' ? product.price : Number(product.price);
    if (isNaN(price)) {
      showErrorToast('Invalid product price');
      return;
    }

    const existing = saleItems.find(item => item.productId === product.id);
    if (existing) {
      setSaleItems(prev =>
        prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * price }
            : item
        )
      );
    } else {
      setSaleItems(prev => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          price: price,
          quantity: 1,
          total: price, // now a number
        },
      ]);
    }
  };

  const removeItem = (productId: number) => {
    setSaleItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setSaleItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: quantity * item.price }
          : item
      )
    );
  };

  const totals = useMemo<SaleTotals>(() => {
    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    const tax = (subtotal * taxAmount) / 100;
    const netAmount = subtotal + tax - discountAmount;
    return { subtotal, tax, netAmount };
  }, [saleItems, taxAmount, discountAmount]);

  const submitSale = async (): Promise<boolean> => {
    if (saleItems.length === 0) {
      showErrorToast('Please add at least one product');
      return false;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

      const payload: SaleFormData = {
        customerName,
        paymentMethod,
        discountAmount,
        taxAmount,
        notes,
        items: saleItems,
        status: 'completed',
      };

      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create sale');

      // Success — caller decides what to do (page shows a modal)
      return true;
    } catch (err: any) {
      showErrorToast(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSaleItems([]);
    setCustomerName('');
    setPaymentMethod('cash');
    setDiscountAmount(0);
    setTaxAmount(0);
    setNotes('');
  };

  return {
    saleItems,
    customerName,
    paymentMethod,
    discountAmount,
    taxAmount,
    notes,
    loading,
    totals,
    setCustomerName,
    setPaymentMethod,
    setDiscountAmount,
    setTaxAmount,
    setNotes,
    addProduct,
    removeItem,
    updateQuantity,
    submitSale,
    resetForm,
  };
}