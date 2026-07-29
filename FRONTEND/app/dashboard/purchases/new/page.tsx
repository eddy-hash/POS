'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { usePurchaseForm } from './hooks/usePurchaseForm';
import { SupplierInfo } from './components/SupplierInfo';
import { ProductSearch } from './components/ProductSearch';
import { PurchaseItemsTable } from './components/PurchaseItemsTable';
import { PurchaseSummary } from './components/PurchaseSummary';
import ConfirmModal from '@/components/ConfirmModal';
import SuccessModal from '@/components/SuccessModal';

export default function NewPurchasePage() {
  const router = useRouter();
  const { products } = useProducts();
  const {
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
  } = usePurchaseForm();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleConfirm = async () => {
    const result = await submitPurchase();
    if (result === true) {
      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    router.push('/dashboard/purchases');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 dark:bg-slate-900 dark:text-white min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Purchase</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Create a new purchase order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SupplierInfo
            supplier={supplier}
            setSupplier={setSupplier}
            notes={notes}
            setNotes={setNotes}
          />
          <ProductSearch products={products} onAddProduct={addProduct} />
          <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <PurchaseItemsTable
              items={items}
              onQuantityChange={updateQuantity}
              onRemoveItem={removeItem}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <PurchaseSummary
            totalAmount={totalAmount}
            itemCount={items.length}
            onConfirm={() => setConfirmOpen(true)}
            submitting={submitting}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Purchase"
        message={`Are you sure you want to create this purchase for ${items.length} item(s) totaling TZS ${totalAmount.toLocaleString()}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmColor="blue"
      />

      <SuccessModal
        isOpen={successOpen}
        onClose={handleSuccessClose}
        title="Purchase Created"
        message="Purchase order has been created successfully."
        buttonText="View Purchases"
        onButtonClick={handleSuccessClose}
      />
    </div>
  );
}
