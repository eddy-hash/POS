'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/lib/toast';

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY_FORM: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function usePasswordChange() {
  const router = useRouter();
  const [form, setForm] = useState<PasswordForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [strength, setStrength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (field: keyof PasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'newPassword') computeStrength(value);
  };

  const computeStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  };

  const validateNew = (value: string): string => {
    if (!value) return 'New password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (form.currentPassword && value === form.currentPassword) {
      return 'New password must be different from current password';
    }
    return '';
  };

  const validateConfirm = (value: string): string => {
    if (!value) return 'Please confirm your new password';
    if (value !== form.newPassword) return 'Passwords do not match';
    return '';
  };

  const validateAll = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    const nErr = validateNew(form.newPassword);
    if (nErr) e.newPassword = nErr;
    const cErr = validateConfirm(form.confirmPassword);
    if (cErr) e.confirmPassword = cErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails('');
    if (!validateAll()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        showErrorToast('Please login again');
        router.push('/');
        return;
      }

      const response = await fetch('/auth/change-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        let msg = data.message || data.error || 'Failed to change password';
        if (data.errors && typeof data.errors === 'object') {
          const msgs = Object.values(data.errors).flat();
          if (msgs.length) msg = msgs.join(', ');
        }
        setErrorDetails(String(msg));
        showErrorToast(String(msg));
        return;
      }

      setShowSuccess(true);
      setForm(EMPTY_FORM);
      setStrength(0);
      setErrors({});
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
    router.push('/dashboard/settings');
  };

  return {
    form,
    errors,
    setErrors,
    loading,
    errorDetails,
    setErrorDetails,
    strength,
    showSuccess,
    updateField,
    validateNew,
    validateConfirm,
    submit,
    closeModal,
  };
}
