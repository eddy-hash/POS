import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createProduct, Category } from '@/lib/products';

const STEPS = ['Basic Info', 'Pricing & Stock', 'Review'];

export function useProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    costPrice: '',
    quantity: '',
    sku: '',
    categoryId: '',
  });
  const [currentStep, setCurrentStep] = useState(0);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
      return form.name.trim().length > 0 && form.categoryId !== '';
    }
    if (currentStep === 1) {
      return form.price !== '' && form.quantity !== '';
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined,
        quantity: parseInt(form.quantity),
        categoryId: parseInt(form.categoryId),
      });
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    form,
    setForm,
    currentStep,
    setCurrentStep,
    steps: STEPS,
    isLastStep,
    canProceed,
    nextStep,
    prevStep,
    handleSubmit,
    loadCategories,
  };
}
