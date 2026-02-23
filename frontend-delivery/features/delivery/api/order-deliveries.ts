import { ApiClient } from '@/lib/api/client'
import type { 
  OrderDeliveryDetailResponse, 
  OrderDeliveryDetailUpdateRequest,
  DeliveryStatus 
} from '@/lib/types/order'

const apiClient = new ApiClient()

export const orderDeliveriesApi = {
  /**
   * Obtener todas las entregas de un driver
   */
  async getByDriverId(driverId: number): Promise<OrderDeliveryDetailResponse[]> {
    return apiClient.get<OrderDeliveryDetailResponse[]>(`/order-deliveries/driver/${driverId}`)
  },

  /**
   * Obtener entregas activas de un driver
   * (ASSIGNED, ACCEPTED, PICKED_UP, OUT_FOR_DELIVERY, ARRIVED)
   */
  async getActiveByDriverId(driverId: number): Promise<OrderDeliveryDetailResponse[]> {
    return apiClient.get<OrderDeliveryDetailResponse[]>(`/order-deliveries/driver/${driverId}/active`)
  },

  /**
   * Obtener entregas pendientes de asignación
   */
  async getPendingAssignment(): Promise<OrderDeliveryDetailResponse[]> {
    return apiClient.get<OrderDeliveryDetailResponse[]>('/order-deliveries/pending')
  },

  /**
   * Obtener detalle de entrega por ID
   */
  async getById(id: number): Promise<OrderDeliveryDetailResponse> {
    return apiClient.get<OrderDeliveryDetailResponse>(`/order-deliveries/${id}`)
  },

  /**
   * Obtener detalle de entrega por orderId
   */
  async getByOrderId(orderId: number): Promise<OrderDeliveryDetailResponse> {
    return apiClient.get<OrderDeliveryDetailResponse>(`/order-deliveries/order/${orderId}`)
  },

  /**
   * Asignar un driver a una entrega
   */
  async assignDriver(deliveryId: number, driverId: number): Promise<OrderDeliveryDetailResponse> {
    return apiClient.put<OrderDeliveryDetailResponse>(`/order-deliveries/${deliveryId}/assign/${driverId}`)
  },

  /**
   * Actualizar estado de entrega
   */
  async update(id: number, request: OrderDeliveryDetailUpdateRequest): Promise<OrderDeliveryDetailResponse> {
    return apiClient.put<OrderDeliveryDetailResponse>(`/order-deliveries/${id}`, request)
  },

  /**
   * Actualizar solo el estado
   */
  async updateStatus(id: number, status: DeliveryStatus): Promise<OrderDeliveryDetailResponse> {
    return apiClient.put<OrderDeliveryDetailResponse>(`/order-deliveries/${id}`, { status })
  },

  // ============ Métodos de conveniencia para cambio de estado ============

  /**
   * Aceptar una entrega asignada
   */
  async acceptDelivery(id: number): Promise<OrderDeliveryDetailResponse> {
    return this.updateStatus(id, 'ACCEPTED' as DeliveryStatus)
  },

  /**
   * Marcar como recogido del restaurante/tienda
   */
  async markPickedUp(id: number): Promise<OrderDeliveryDetailResponse> {
    return this.updateStatus(id, 'PICKED_UP' as DeliveryStatus)
  },

  /**
   * Marcar como en camino
   */
  async markOutForDelivery(id: number): Promise<OrderDeliveryDetailResponse> {
    return this.updateStatus(id, 'OUT_FOR_DELIVERY' as DeliveryStatus)
  },

  /**
   * Marcar como llegó al destino
   */
  async markArrived(id: number): Promise<OrderDeliveryDetailResponse> {
    return this.updateStatus(id, 'ARRIVED' as DeliveryStatus)
  },

  /**
   * Marcar como entregado
   */
  async markDelivered(id: number): Promise<OrderDeliveryDetailResponse> {
    return this.updateStatus(id, 'DELIVERED' as DeliveryStatus)
  },

  /**
   * Cancelar una entrega
   */
  async cancelDelivery(id: number, driverNotes?: string): Promise<OrderDeliveryDetailResponse> {
    return apiClient.put<OrderDeliveryDetailResponse>(`/order-deliveries/${id}`, { 
      status: 'CANCELLED' as DeliveryStatus,
      driverNotes 
    })
  },

  /**
   * Agregar notas del driver
   */
  async addDriverNotes(id: number, driverNotes: string): Promise<OrderDeliveryDetailResponse> {
    return apiClient.put<OrderDeliveryDetailResponse>(`/order-deliveries/${id}`, { driverNotes })
  },

  /**
   * Driver acepta una orden pendiente (modelo Uber: primero en aceptar la obtiene).
   * Retorna null si ya fue tomada por otro driver (HTTP 409).
   */
  async acceptOrder(deliveryId: number, driverId: number): Promise<OrderDeliveryDetailResponse | null> {
    try {
      return await apiClient.post<OrderDeliveryDetailResponse>(
        `/order-deliveries/${deliveryId}/accept/${driverId}`,
        {}
      )
    } catch (err: any) {
      if (err?.status === 409 || err?.response?.status === 409) return null
      return null
    }
  },
}
