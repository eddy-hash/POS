'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/services/api';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  roleId: number;
  isActive: boolean;
}

export function useProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.get('/users/profile', token);
      
      // Extract user data from nested response
      let userData = response;
      if (response?.data?.data) {
        userData = response.data.data;
      } else if (response?.data) {
        userData = response.data;
      }
      
      setProfile(userData);
    } catch (err: any) {
      setError(err.message);
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!profile) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await api.put(`/users/${profile.id}`, {
        name: updatedData.name,
        phone: updatedData.phone,
        address: updatedData.address,
      }, token);
      showSuccessToast('Profile updated successfully');
      setModalOpen(true);
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    router.push('/dashboard/settings');
  };

  const retryFetch = () => {
    setError('');
    fetchProfile();
  };

  return {
    loading,
    saving,
    profile,
    setProfile,
    error,
    modalOpen,
    updateProfile,
    closeModal,
    retryFetch,
  };
}
