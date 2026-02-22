// Order types (simplificado - datos de delivery ahora en OrderDeliveryDetailResponse)
export interface OrderResponse {
  id: number
  userId: number
  orderDate: string
  status: string
  total: number
  pickupMethod: string
  updatedAt: string
  items?: OrderDetailResponse[]
}

export interface OrderDetailResponse {
  id: number
  orderId: number
  productId: number
  productName: string
  productImage: string | null
  quantity: number
  price: number
  subtotal: number
}

// Order Delivery Detail - datos de entrega desde delivery-service
export interface OrderDeliveryDetailResponse {
  id: number
  orderId: number
  deliveryDriver: {
    id: number
    name: string
    phone: string | null
  } | null
  customerName: string | null
  customerPhone: string | null
  status: DeliveryStatus
  destinationLat: number | null
  destinationLng: number | null
  destinationAddress: string | null
  customerNotes: string | null
  driverNotes: string | null
  assignedAt: string | null
  acceptedAt: string | null
  pickedUpAt: string | null
  outForDeliveryAt: string | null
  arrivedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderDeliveryDetailUpdateRequest {
  status?: DeliveryStatus
  driverNotes?: string
  destinationLat?: number
  destinationLng?: number
  destinationAddress?: string
}

// Delivery Status enum
export enum DeliveryStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Order Status enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
