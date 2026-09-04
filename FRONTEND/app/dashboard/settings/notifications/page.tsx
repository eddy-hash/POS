'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  BellIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  UsersIcon,
  MegaphoneIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { api } from '@/lib/services/api';
import SuccessModal from '@/components/SuccessModal';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'sales',
      title: 'Sales Alerts',
      description: 'Get notified when a new sale is made',
      icon: ShoppingBagIcon,
      enabled: true,
    },
    {
      id: 'expenses',
      title: 'Expense Alerts',
      description: 'Get notified when a new expense is recorded',
      icon: CreditCardIcon,
      enabled: true,
    },
    {
      id: 'customers',
      title: 'Customer Activity',
      description: 'Get notified about new customers',
      icon: UsersIcon,
      enabled: false,
    },
    {
      id: 'promotions',
      title: 'Promotions & Offers',
      description: 'Get notified about special promotions',
      icon: MegaphoneIcon,
      enabled: false,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: EnvelopeIcon,
      enabled: true,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/'); return; }
      const data = await api.get('/users/notifications/preferences', token);
      const prefs = data?.data || data;
      if (prefs) {
        setPreferences(prev => prev.map(p => ({
          ...p,
          enabled: prefs[p.id] !== undefined ? prefs[p.id] : p.enabled,
        })));
      }
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPreferences(); }, []);

  const togglePreference = (id: string) => {
    setPreferences(prev => prev.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const payload = preferences.reduce((acc, p) => ({ ...acc, [p.id]: p.enabled }), {});
      await api.put('/users/notifications/preferences', payload, token);
      setModalTitle('Preferences Saved');
      setModalMessage('Your notification preferences have been updated successfully.');
      setModalOpen(true);
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      showSuccessToast('🔔 Test notification!');
    } catch (err: any) {
      showErrorToast(err.message);
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Configure your notification preferences</p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleTestNotification}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300"
          >
            <BellIcon className="h-4 w-4" />
            <span className="hidden xs:inline">Test</span>
          </button>
          <button
            onClick={fetchPreferences}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="hidden xs:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6 max-w-2xl">
        <div className="space-y-4">
          <AnimatePresence>
            {preferences.map((pref, index) => {
              const Icon = pref.icon;
              return (
                <motion.div
                  key={pref.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">{pref.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{pref.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePreference(pref.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      pref.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Save Preferences
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/settings')}
            className="w-full sm:px-6 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium text-center"
          >
            Cancel
          </button>
        </div>
      </div>

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
