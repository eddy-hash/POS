'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useRegister() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (form.username.trim().length > 0) {
      if (form.username.trim().length < 3) {
        setError('Username must be at least 3 characters');
        return false;
      }
      if (!/^[a-zA-Z0-9_.-]+$/.test(form.username.trim())) {
        setError('Username can only contain letters, numbers, dots, underscores, dashes');
        return false;
      }
    }
    if (form.name.trim().length < 10) {
      setError('Name must be at least 10 characters');
      return false;
    }
    if (!/^[a-zA-Z\s]*$/.test(form.name)) {
      setError('Name can only contain letters and spaces');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          username: form.username.trim() || undefined,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
      } else {
        // Prefer per-field messages; fall back to `message`
        let msg = 'Registration failed';

        if (data?.errors && typeof data.errors === 'object') {
          // Map field name → first sentence, drop duplicates
          const seen = new Set<string>();
          const parts: string[] = [];
          for (const [field, raw] of Object.entries(data.errors as Record<string, string>)) {
            const first = String(raw).split(',')[0].trim(); // first rule only
            if (!seen.has(first)) {
              seen.add(first);
              parts.push(first);
            }
          }
          if (parts.length) msg = parts.join(' • ');
        } else if (Array.isArray(data?.message)) {
          msg = data.message.join(' • ');
        } else if (typeof data?.message === 'string' && data.message) {
          msg = data.message;
        }

        setError(msg);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    router.push('/login');
  };

  return {
    form,
    updateField,
    loading,
    error,
    showModal,
    handleSubmit,
    closeModal,
  };
}
