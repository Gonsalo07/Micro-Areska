/**
 * Estados de orden (status) - Controlados por el negocio/restaurante
 * Representan el estado de preparación del pedido
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

/**
 * Estados de entrega (delivery_status) - Controlados por el repartidor
 * Representan el estado logístico de la entrega
 */
export const DELIVERY_STATUS = {
  PENDING_ASSIGNMENT: 'PENDING_ASSIGNMENT',
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  ARRIVED: 'ARRIVED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const

export type DeliveryStatus = (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS]

/**
 * Labels en español para los estados de orden
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.PREPARING]: 'En preparación',
  [ORDER_STATUS.READY]: 'Listo',
  [ORDER_STATUS.COMPLETED]: 'Completado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
}

/**
 * Labels en español para los estados de entrega
 */
export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  [DELIVERY_STATUS.PENDING_ASSIGNMENT]: 'Pendiente de asignación',
  [DELIVERY_STATUS.ASSIGNED]: 'Asignado',
  [DELIVERY_STATUS.ACCEPTED]: 'Aceptado',
  [DELIVERY_STATUS.PICKED_UP]: 'Recogido',
  [DELIVERY_STATUS.OUT_FOR_DELIVERY]: 'En camino',
  [DELIVERY_STATUS.ARRIVED]: 'Llegó al destino',
  [DELIVERY_STATUS.DELIVERED]: 'Entregado',
  [DELIVERY_STATUS.CANCELLED]: 'Cancelado',
}

/**
 * Colores para los estados de orden (Tailwind classes)
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  [ORDER_STATUS.PREPARING]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  [ORDER_STATUS.READY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  [ORDER_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

/**
 * Colores para los estados de entrega (Tailwind classes)
 */
export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  [DELIVERY_STATUS.PENDING_ASSIGNMENT]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
  [DELIVERY_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  [DELIVERY_STATUS.ACCEPTED]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  [DELIVERY_STATUS.PICKED_UP]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  [DELIVERY_STATUS.OUT_FOR_DELIVERY]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  [DELIVERY_STATUS.ARRIVED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  [DELIVERY_STATUS.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  [DELIVERY_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

/**
 * Helper para obtener el label de un estado de orden
 */
export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status
}

/**
 * Helper para obtener el label de un estado de entrega
 */
export function getDeliveryStatusLabel(status: string): string {
  return DELIVERY_STATUS_LABELS[status as DeliveryStatus] || status
}

/**
 * Helper para obtener los colores de un estado de orden
 */
export function getOrderStatusColor(status: string): string {
  return ORDER_STATUS_COLORS[status as OrderStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}

/**
 * Helper para obtener los colores de un estado de entrega
 */
export function getDeliveryStatusColor(status: string): string {
  return DELIVERY_STATUS_COLORS[status as DeliveryStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}

/**
 * Verifica si el chat está habilitado basado en el estado de entrega
 */
export function isChatEnabled(deliveryStatus: string): boolean {
  return (
    deliveryStatus === DELIVERY_STATUS.OUT_FOR_DELIVERY ||
    deliveryStatus === DELIVERY_STATUS.ARRIVED
  )
}

/**
 * Verifica si la entrega está activa (no finalizada ni cancelada)
 */
export function isDeliveryActive(deliveryStatus: string): boolean {
  return (
    deliveryStatus !== DELIVERY_STATUS.DELIVERED &&
    deliveryStatus !== DELIVERY_STATUS.CANCELLED
  )
}
