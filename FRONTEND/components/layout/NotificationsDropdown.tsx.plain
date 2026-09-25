'use client';

import { useState, useEffect, useRef } from 'react';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useThemeSafe } from '@/context/ThemeContext';
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotificationById } from '@/lib/notificationService';
import { getAuthToken } from '@/lib/auth';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

interface NotificationsDropdownProps {
  size?: 'sm' | 'md';
  isMobile?: boolean;
}

export default function NotificationsDropdown({ size = 'md', isMobile = false }: NotificationsDropdownProps) {
  const theme = useThemeSafe();
  const isDark = theme?.isDark || false;
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const token = getAuthToken();
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchUserNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      showErrorToast('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      showSuccessToast('All notifications marked as read');
    } catch (error) {
      showErrorToast('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationById(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      showErrorToast('Failed to delete notification');
    }
  };

  const iconSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const buttonSize = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-lg transition-colors ${isDark ? 'hover:bg-blue-500/10' : 'hover:bg-slate-100'} ${buttonSize}`}
        aria-label="Notifications"
      >
        <BellIcon className={`${iconSize} ${isDark ? 'text-white' : 'text-slate-700'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-lg border overflow-hidden z-50 ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className={`text-xs font-medium ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <BellIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 transition-colors ${
                      !notification.isRead 
                        ? isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                        : ''
                    } ${
                      isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {notification.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-[10px] mt-1 ${
                          isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className={`p-1 rounded ${
                              isDark ? 'hover:bg-blue-500/20' : 'hover:bg-blue-100'
                            }`}
                            title="Mark as read"
                          >
                            <CheckIcon className={`h-4 w-4 ${
                              isDark ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className={`p-1 rounded ${
                            isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-100'
                          }`}
                          title="Delete"
                        >
                          <XMarkIcon className={`h-4 w-4 ${
                            isDark ? 'text-red-400' : 'text-red-600'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
