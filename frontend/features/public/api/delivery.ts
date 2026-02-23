import { apiClient } from '@/lib/api/client'
import type { DeliveryStatus } from '@/lib/constants/order-status'

/**
 * Detalle de entrega para una orden con pickup_method = 'delivery'
 * Esta información viene del delivery-service
 */
export interface OrderDeliveryDetail {
  id: number
  orderId: number

  // Driver info (null si no está asignado)
  deliveryDriverId?: number
  driverName?: string
  driverPhone?: string
  driverPhotoUrl?: string
  driverCurrentLat?: number
  driverCurrentLng?: number

  // Destino
  destinationAddress: string
  destinationLat?: number
  destinationLng?: number
  destinationReference?: string

  // Comentarios
  customerNotes?: string
  driverNotes?: string

  // Estado
  status: DeliveryStatus

  // Timestamps
  assignedAt?: string
  acceptedAt?: string
  pickedUpAt?: string
  outForDeliveryAt?: string
  arrivedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  cancellationReason?: string

  createdAt: string
  updatedAt?: string
}

const RESOURCE = 'order-deliveries'

export const deliveryApi = {
  /**
   * Obtener detalle de entrega por order ID
   */
  async getByOrderId(orderId: number): Promise<OrderDeliveryDetail | null> {
    try {
      const response = await apiClient.get<OrderDeliveryDetail>(`/${RESOURCE}/order/${orderId}`)
      return response
    } catch {
      return null
    }
  },

  /**
   * Obtener todos los detalles de entrega para un driver
   */
  async getByDriverId(driverId: number): Promise<OrderDeliveryDetail[]> {
    try {
      const response = await apiClient.get<OrderDeliveryDetail[]>(`/${RESOURCE}/driver/${driverId}`)
      return response || []
    } catch {
      return []
    }
  },

  /**
   * Obtener entregas activas de un driver
   */
  async getActiveByDriverId(driverId: number): Promise<OrderDeliveryDetail[]> {
    try {
      const response = await apiClient.get<OrderDeliveryDetail[]>(
        `/${RESOURCE}/driver/${driverId}/active`
      )
      return response || []
    } catch {
      return []
    }
  },

  /**
   * Obtener entregas pendientes de asignación
   */
  async getPendingAssignment(): Promise<OrderDeliveryDetail[]> {
    try {
      const response = await apiClient.get<OrderDeliveryDetail[]>(`/${RESOURCE}/pending`)
      return response || []
    } catch {
      return []
    }
  },
}
