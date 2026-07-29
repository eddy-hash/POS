import axios from 'axios';
import { getAuthToken } from './auth';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  type?: string;
  referenceId?: number;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = getAuthToken();
      if (token) {
        localStorage.removeItem('access_token');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getNotifications = async (): Promise<{ notifications: Notification[]; unreadCount: number }> => {
  const token = getAuthToken();
  if (!token) {
    // Silent return - no console logs
    return { notifications: [], unreadCount: 0 };
  }

  try {
    const response = await api.get('/notifications');
    
    let data = response.data;
    if (data && data.data) {
      data = data.data;
    }
    
    if (data && data.notifications !== undefined) {
      return {
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
      };
    }
    
    if (Array.isArray(data)) {
      return {
        notifications: data,
        unreadCount: data.filter((n: Notification) => !n.isRead).length,
      };
    }
    
    return { notifications: [], unreadCount: 0 };
  } catch (error: any) {
    // Silent error handling - no console logs for expected errors
    if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
      return { notifications: [], unreadCount: 0 };
    }
    // Only log unexpected errors
    console.error('❌ [getNotifications] Unexpected error:', error.message);
    return { notifications: [], unreadCount: 0 };
  }
};

export const markAsRead = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) return;
    await api.patch(`/notifications/${id}/read`);
  } catch (error) {
    // Silent fail
  }
};

export const markAllAsRead = async (): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) return;
    await api.patch('/notifications/read-all');
  } catch (error) {
    // Silent fail
  }
};

export const deleteNotification = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) return;
    await api.delete(`/notifications/${id}`);
  } catch (error) {
    // Silent fail
  }
};
