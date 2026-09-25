'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProducts } from './hooks/useProducts';
import { usePurchaseForm } from './hooks/usePurchaseForm';
import { usePurchaseWizard } from './hooks/usePurchaseWizard';
import { SupplierStep } from './components/SupplierStep';
import { ProductsStep } from './components/ProductsStep';
import { ReviewStep } from './components/ReviewStep';
import { PurchaseNavigation } from './components/PurchaseNavigation';
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
    resetForm,
  } = usePurchaseForm();

  const { currentStep, steps, isLastStep, isFirstStep, nextStep, prevStep, canProceed, resetWizard } =
    usePurchaseWizard();

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
  };

  const handleNewPurchase = () => {
    resetForm();
    resetWizard();
    setSuccessOpen(false);
  };

  const handleViewPurchases = () => {
    setSuccessOpen(false);
    router.push('/dashboard/purchases');
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return <SupplierStep supplier={supplier} setSupplier={setSupplier} notes={notes} setNotes={setNotes} />;
      case 1:
        return (
          <ProductsStep
            products={products}
            items={items}
            onAddProduct={addProduct}
            onQuantityChange={updateQuantity}
            onRemoveItem={removeItem}
          />
        );
      case 2:
        return (
          <ReviewStep
            totalAmount={totalAmount}
            itemCount={items.length}
            onConfirm={() => setConfirmOpen(true)}
            submitting={submitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 dark:bg-slate-900 dark:text-white min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Purchase</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-6">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 flex-1 rounded-full transition-all ${
              idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[300px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`step-${currentStep}`}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            {stepContent()}
          </motion.div>
        </AnimatePresence>

        <PurchaseNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceed={canProceed(items, supplier)}
          loading={submitting}
          isLastStep={isLastStep}
          onBack={prevStep}
          onNext={isLastStep ? () => setConfirmOpen(true) : nextStep}
        />
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
        title="Purchase Created!"
        message="Purchase order has been created successfully."
        buttonText="New Purchase"
        onButtonClick={handleNewPurchase}
        secondaryButtonText="View All Purchases"
        onSecondaryButtonClick={handleViewPurchases}
      />
    </div>
  );
}
