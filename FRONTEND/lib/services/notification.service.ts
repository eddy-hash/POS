import { api } from '@/lib/services/api';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  referenceId?: number;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  getAll: async (): Promise<{ notifications: Notification[]; unreadCount: number }> => {
    const token = localStorage.getItem('access_token');
    const response = await api.get('/notifications', token);
    const data = response?.data || response;
    return {
      notifications: data?.notifications || [],
      unreadCount: data?.unreadCount || 0,
    };
  },
  markAsRead: async (id: number): Promise<void> => {
    const token = localStorage.getItem('access_token');
    await api.patch(`/notifications/${id}/read`, {}, token);
  },
  markAllAsRead: async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    await api.patch('/notifications/read-all', {}, token);
  },
};
