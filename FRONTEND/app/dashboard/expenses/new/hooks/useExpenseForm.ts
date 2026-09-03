import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { expenseService } from '@/lib/services/expense.service';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

const STEPS = ['Basic Info', 'Amount', 'Review'];

export function useExpenseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    expenseDate: '',
  });

  const nextStep = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = () => {
    if (currentStep === 0) {
      return form.description.trim().length > 0 && form.category !== '';
    }
    if (currentStep === 1) {
      const amount = parseFloat(form.amount);
      return !isNaN(amount) && amount > 0;
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const expenseData = {
        ...form,
        amount: parseFloat(form.amount),
        expenseDate: form.expenseDate || new Date().toISOString().split('T')[0],
      };

      if (isNaN(expenseData.amount) || expenseData.amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      await expenseService.create(expenseData);
      showSuccessToast('Expense added successfully');
      router.push('/dashboard/expenses');
    } catch (err: any) {
      setError(err.message || 'Failed to create expense');
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    error,
    currentStep,
    steps: STEPS,
    isLastStep,
    canProceed,
    nextStep,
    prevStep,
    handleSubmit,
  };
}
