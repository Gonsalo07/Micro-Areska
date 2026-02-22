import type {
  DeliveryDriverNotificationRequest,
  DeliveryDriverNotificationResponse,
} from '@/lib/types/delivery'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'delivery-driver-notifications'

export const notificationsApi = {
  /**
   * Create a new notification
   */
  async create(payload: DeliveryDriverNotificationRequest) {
    return apiClient.post<DeliveryDriverNotificationResponse>(`/${RESOURCE}`, payload)
  },

  /**
   * Get all notifications for a driver
   */
  async getByDriverId(driverId: number) {
    return apiClient.get<DeliveryDriverNotificationResponse[]>(`/${RESOURCE}/driver/${driverId}`)
  },

  /**
   * Get unread notifications for a driver
   */
  async getUnreadByDriverId(driverId: number) {
    return apiClient.get<DeliveryDriverNotificationResponse[]>(
      `/${RESOURCE}/driver/${driverId}/unread`
    )
  },

  /**
   * Get notifications for a specific order
   */
  async getByOrderId(orderId: number) {
    return apiClient.get<DeliveryDriverNotificationResponse[]>(`/${RESOURCE}/order/${orderId}`)
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number) {
    return apiClient.patch<DeliveryDriverNotificationResponse>(
      `/${RESOURCE}/${notificationId}/read`
    )
  },

  /**
   * Mark all notifications as read for a driver
   */
  async markAllAsRead(driverId: number) {
    return apiClient.patch<void>(`/${RESOURCE}/driver/${driverId}/read-all`)
  },
}
