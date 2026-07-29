'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { showErrorToast } from '@/lib/toast';
import SuccessModal from '@/components/SuccessModal';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/'); return; }
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) { localStorage.removeItem('access_token'); router.push('/'); return; }
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      const userData = data.data || data;
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails('');

    if (!user.name.trim()) {
      showErrorToast('Name is required');
      return;
    }
    if (!user.email.trim()) {
      showErrorToast('Email is required');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/'); return; }
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const payload = {
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
        phone: user.phone ? String(user.phone).trim() : '',
        address: user.address ? String(user.address).trim() : '',
      };

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Failed to update profile';
        setErrorDetails(errorMessage);
        showErrorToast(errorMessage);
        return;
      }

      // ✅ Success – show modal
      setModalTitle('Profile Updated');
      setModalMessage('Your profile has been updated successfully.');
      setModalOpen(true);
    } catch (err: any) {
      console.error('❌ Profile update error:', err);
      showErrorToast(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    router.push('/dashboard/settings');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Update your personal information</p>
        </div>
        <button
          onClick={fetchProfile}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span className="hidden xs:inline">Refresh</span>
        </button>
      </div>

      {errorDetails && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          <p className="font-medium">Error:</p>
          <p className="whitespace-pre-wrap break-words">{errorDetails}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <UserIcon className="h-4 w-4 inline mr-1" /> Full Name *
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <EnvelopeIcon className="h-4 w-4 inline mr-1" /> Email *
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <PhoneIcon className="h-4 w-4 inline mr-1" /> Phone
            </label>
            <input
              type="tel"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="+255 700 000 000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              <HomeIcon className="h-4 w-4 inline mr-1" /> Address
            </label>
            <input
              type="text"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Your address"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/settings')}
            className="w-full sm:px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium text-center"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        buttonText="Continue"
        onButtonClick={handleModalClose}
      />
    </div>
  );
}
