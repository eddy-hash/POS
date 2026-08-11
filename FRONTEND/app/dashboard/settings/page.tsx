'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowPathIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { showErrorToast } from '@/lib/toast';
import SuccessModal from '@/components/SuccessModal';
import { useThemeSafe } from '@/context/ThemeContext';
import { useCurrencySafe } from '@/context/CurrencyContext';

export default function SettingsPage() {
  const router = useRouter();
  const themeContext = useThemeSafe();
  const isDark = themeContext?.isDark ?? false;
  const toggleTheme = themeContext?.toggleTheme || (() => {});

  const currencyContext = useCurrencySafe();
  const currency = currencyContext?.currency || 'TZS';
  const setCurrency = currencyContext?.setCurrency || (() => {});
  const symbols = currencyContext?.symbols || {};
  const loading = currencyContext?.loading || false;

  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  const fetchUserProfile = async () => {
    try {
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
        id: userData.id,
        name: userData.name || 'User',
        email: userData.email || 'No email registered',
        phone: userData.phone || '',
        address: userData.address || '',
        role: userData.role || 'viewer',
      });
    } catch (err: any) {
      showErrorToast(err.message);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    const newDark = !isDark;
    setModalTitle('Theme Updated');
    setModalMessage(`Switched to ${newDark ? 'Dark' : 'Light'} mode.`);
    setModalOpen(true);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: newCurrency } }));
    const symbol = symbols[newCurrency] || newCurrency;
    setModalTitle('Currency Updated');
    setModalMessage(`Currency changed to ${newCurrency} (${symbol})`);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const currencies = [
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  ];

  const settingsSections = [
    {
      title: 'Appearance',
      icon: isDark ? SunIcon : MoonIcon,
      description: `Currently in ${isDark ? 'Dark' : 'Light'} mode`,
      action: handleThemeToggle,
      actionLabel: isDark ? 'Switch to Light' : 'Switch to Dark',
    },
    {
      title: 'Profile',
      icon: UserIcon,
      description: 'Manage your account information',
      action: () => router.push('/dashboard/settings/profile'),
      actionLabel: 'Edit Profile',
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      description: 'Configure notification preferences',
      action: () => router.push('/dashboard/settings/notifications'),
      actionLabel: 'Configure',
    },
    {
      title: 'Security',
      icon: ShieldCheckIcon,
      description: 'Password and security settings',
      action: () => router.push('/dashboard/settings/security'),
      actionLabel: 'Manage',
    },
  ];

  return (
    <div className="space-y-4 dark:bg-slate-900 dark:text-white p-3 sm:p-4 md:p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cog6ToothIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-600 dark:text-blue-400" /> Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Manage your application preferences</p>
        </div>
        <button onClick={fetchUserProfile} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm text-slate-700 dark:text-slate-300">
          <ArrowPathIcon className="h-4 w-4" />
          <span className="hidden xs:inline">Refresh</span>
        </button>
      </div>

      {user && (
        <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{user.name}</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              {user.role && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mt-1">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
            <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Currency</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Select your preferred currency</p>
            <div className="mt-3">
              <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="w-full sm:w-64 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                disabled={loading}
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
              {loading && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Loading rates...</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white dark:!bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{section.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{section.description}</p>
                  </div>
                </div>
                <button
                  onClick={section.action}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap flex-shrink-0"
                >
                  {section.actionLabel}
                </button>
              </div>
            </div>
          );
        })}
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
