import type { OrderResponse } from '@/lib/types/order'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'orders'

/**
 * API para obtener información básica de órdenes.
 * Para operaciones de delivery (asignar driver, cambiar estado, etc.), 
 * usar orderDeliveriesApi en order-deliveries.ts
 */
export const ordersApi = {
  /**
   * Get all orders
   */
  async getAll() {
    return apiClient.get<OrderResponse[]>(`/${RESOURCE}`)
  },

  /**
   * Get order by ID (with items)
   */
  async getById(id: number) {
    return apiClient.get<OrderResponse>(`/${RESOURCE}/${id}`)
  },

  /**
   * Get orders by user Firebase UID
   */
  async getByUserFirebaseUid(firebaseUid: string) {
    return apiClient.get<OrderResponse[]>(`/${RESOURCE}/user-by-firebase-uid/${firebaseUid}`)
  },

  /**
   * Get orders by user ID
   */
  async getByUserId(userId: number) {
    return apiClient.get<OrderResponse[]>(`/${RESOURCE}/user/${userId}`)
  },
}
