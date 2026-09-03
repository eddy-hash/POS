'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { ProfileLoading } from './components/ProfileLoading';
import { ProfileError } from './components/ProfileError';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileForm } from './components/ProfileForm';
import { ProfileActions } from './components/ProfileActions';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  roleId: number;
  isActive: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setProfile(data);
      showSuccessToast('Profile loaded successfully');
    } catch (err: any) {
      setError(err.message);
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

      const response = await fetch(`${API_URL}/users/${profile.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      showSuccessToast('Profile updated successfully');
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileLoading />;
  if (error) return <ProfileError error={error} onRetry={fetchProfile} />;

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="max-w-3xl mx-auto px-4 sm:px-0 py-4 sm:py-6">
        <ProfileHeader />
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <ProfileAvatar
            name={profile?.name || ''}
            email={profile?.email || ''}
            isActive={profile?.isActive || false}
          />
          {/* Centered wrapper for form fields */}
          <div className="max-w-xl mx-auto">
            <ProfileForm profile={profile!} setProfile={setProfile} />
            <ProfileActions saving={saving} />
          </div>
        </form>
      </div>
    </>
  );
}