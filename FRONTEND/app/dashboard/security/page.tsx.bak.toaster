'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SecurityPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      ip: '192.168.1.100',
      location: 'Dar es Salaam, Tanzania',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari 17',
      ip: '192.168.1.101',
      location: 'Dar es Salaam, Tanzania',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Firefox 121',
      ip: '192.168.1.102',
      location: 'Arusha, Tanzania',
      lastActive: '3 days ago',
      isCurrent: false,
    },
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoutAll = async () => {
    if (!confirm('This will log you out from all devices except this one. Continue?')) return;
    
    setLoading(true);
    try {
      // API call to logout all sessions
      showSuccessToast('Logged out from all other devices');
      setSessions(sessions.filter(s => s.isCurrent));
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    setLoading(true);
    try {
      // API call to toggle 2FA
      setTwoFactorEnabled(!twoFactorEnabled);
      showSuccessToast(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
    } catch (err: any) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg outline-none hover:bg-slate-100 transition">
            <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your security settings</p>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {twoFactorEnabled ? 'Enabled ✓' : 'Disabled'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleTwoFactor}
              disabled={loading}
              className={`px-4 py-2 rounded-lg outline-none font-medium transition ${
                twoFactorEnabled 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading ? 'Loading...' : twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Active Sessions</h3>
              <p className="text-sm text-slate-500">Devices currently logged into your account</p>
            </div>
            <button
              onClick={handleLogoutAll}
              disabled={loading || sessions.filter(s => !s.isCurrent).length === 0}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition disabled:opacity-50"
            >
              Logout All Other Devices
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-lg outline-none border ${
                  session.isCurrent 
                    ? 'border-blue-200 bg-blue-50/50' 
                    : 'border-slate-200 hover:bg-slate-50'
                } transition`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{session.device}</p>
                      {session.isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {session.browser} • {session.ip} • {session.location}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ClockIcon className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{session.lastActive}</span>
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button className="text-sm text-red-500 hover:text-red-600">
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg outline-none border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ExclamationTriangleIcon className="h-4 w-4 text-slate-400" />
              <span>If you don't recognize a device, logout immediately and change your password</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
