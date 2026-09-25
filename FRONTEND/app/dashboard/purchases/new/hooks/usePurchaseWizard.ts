import { useState } from 'react';

const STEPS = ['Supplier', 'Products', 'Review'];

export function usePurchaseWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const resetWizard = () => setCurrentStep(0);

  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const canProceed = (items: any[], supplier: string) => {
    if (currentStep === 0) {
      return supplier.trim().length > 0;
    }
    if (currentStep === 1) {
      return items.length > 0;
    }
    return true;
  };

  return {
    currentStep,
    steps: STEPS,
    isLastStep,
    isFirstStep,
    nextStep,
    prevStep,
    resetWizard,
    canProceed,
  };
}
