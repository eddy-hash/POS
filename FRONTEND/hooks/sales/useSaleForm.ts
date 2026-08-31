'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SaleItem } from '@/types/sales';

export function useSaleForm() {
  const router = useRouter();
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const totals = saleItems.reduce(
    (acc, item) => {
      acc.subtotal += item.total;
      acc.total = acc.subtotal - discountAmount + taxAmount;
      return acc;
    },
    { subtotal: 0, discount: discountAmount, tax: taxAmount, total: 0 }
  );

  const addProduct = async (productId: string) => {
    // Implementation
    toast.success('Product added');
  };

  const removeItem = (itemId: string) => {
    setSaleItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setSaleItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      )
    );
  };

  const submitSale = async () => {
    if (saleItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      // Submit sale
      toast.success('Sale completed successfully!');
      router.push('/sales');
    } catch (error) {
      toast.error('Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  return {
    saleItems,
    customerPhone,
    paymentMethod,
    discountAmount,
    taxAmount,
    notes,
    loading,
    totals,
    setCustomerPhone,
    setPaymentMethod,
    setDiscountAmount,
    setTaxAmount,
    setNotes,
    addProduct,
    removeItem,
    updateQuantity,
    submitSale,
  };
}
