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
   * Get order by ID (with items).
   * Uses Next.js proxy to order-service (delivery app drivers lack gateway access to /api/orders).
   */
  async getById(id: number) {
    const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
    const text = await res.text();

    if (!text || text.trim() === "") {
      throw new Error("Empty order response");
    }

    const json = JSON.parse(text) as {
      success: boolean;
      data?: OrderResponse;
      message?: string;
    };

    if (!json.success || !json.data) {
      throw new Error(json.message ?? `Failed to load order ${id}`);
    }

    return json.data;
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
