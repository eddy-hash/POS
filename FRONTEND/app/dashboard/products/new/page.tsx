'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProductForm } from './hooks/useProductForm';
import { ProductBasicInfo } from './components/ProductBasicInfo';
import { ProductPricing } from './components/ProductPricing';
import { ProductReview } from './components/ProductReview';
import { ProductNavigation } from './components/ProductNavigation';

export default function NewProductPage() {
  const router = useRouter();
  const {
    categories,
    loading,
    error,
    form,
    setForm,
    currentStep,
    steps,
    isLastStep,
    canProceed,
    nextStep,
    prevStep,
    handleSubmit,
  } = useProductForm();

  // ─── Memoize step content ──────────────────────────────────────
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <ProductBasicInfo form={form} setForm={setForm} categories={categories} />;
      case 1:
        return <ProductPricing form={form} setForm={setForm} />;
      case 2:
        return <ProductReview form={form} categories={categories} error={error} />;
      default:
        return null;
    }
  }, [currentStep, form, categories, error]);

  return (
    <div className="max-w-3xl mx-auto dark:bg-slate-900 dark:text-white min-h-screen p-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg outline-none hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 min-h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>

        <ProductNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceed={canProceed()}
          loading={loading}
          isLastStep={isLastStep}
          onBack={prevStep}
          onNext={nextStep}
        />
      </form>
    </div>
  );
}