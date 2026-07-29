import { getNotifications, markAsRead, markAllAsRead, deleteNotification, Notification } from './notifications';
import { getAuthToken } from './auth';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export const fetchUserNotifications = async (): Promise<NotificationState> => {
  // Check if user is authenticated BEFORE calling getNotifications
  const token = getAuthToken();
  if (!token) {
    return { notifications: [], unreadCount: 0 };
  }
  
  try {
    return await getNotifications();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { notifications: [], unreadCount: 0 };
  }
};

export const markNotificationAsRead = markAsRead;
export const markAllNotificationsAsRead = markAllAsRead;
export const removeNotification = deleteNotification;
export const deleteNotificationById = deleteNotification;
