import { apiClient } from '@/lib/api/client'

export interface OrderItem {
  id: number
  orderId: number
  product: {
    id: number
    name: string
  }
  quantity: number
  unitPrice: number
  priceTotal: number
}

export interface OrderResponse {
  id: number
  userId: number
  orderDate: string
  status: string
  total: number
  pickupMethod: string
  items: OrderItem[]
}

export type CreateOrderItem = {
  productId: number | string
  quantity: number
  unitPrice: number
  priceTotal: number
}

export type CreateOrderPayload = {
  userId?: number
  orderDate?: string
  orderCode?: string
  firebaseUid?: string
  customer?: {
    email: string
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    dni?: string
    docType?: 'boleta' | 'factura'
    docNumber?: string
    firebaseUid?: string
  }
  status: 'pending' | 'completed' | 'shipped' | 'cancelled'
  total: number
  pickupMethod: 'shipping' | 'store'
  items: CreateOrderItem[]
}

const RESOURCE = 'orders'

export const ordersApi = {
  async getByFirebaseUid(firebaseUid: string) {
    try {
      if (!firebaseUid) {
        return []
      }

      const data = await apiClient.get<OrderResponse[]>(
        `/${RESOURCE}/user-by-firebase-uid/${firebaseUid}`
      )
      return data || []
    } catch {
      return []
    }
  },

  async createOrder(payload: CreateOrderPayload) {
    const now = new Date()
    const limaOffset = -5 * 60
    const limaDate = new Date(now.getTime() + (now.getTimezoneOffset() + limaOffset) * 60000)

    const limaFmt = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const orderDate = limaFmt.format(limaDate)

    return apiClient.post<OrderResponse>(`/${RESOURCE}`, {
      ...payload,
      orderDate,
      firebaseUid: payload.firebaseUid,
      userId: payload.userId,
    })
  },

  async getById(orderId: number) {
    return apiClient.get<OrderResponse>(`/${RESOURCE}/${orderId}`)
  },
}
