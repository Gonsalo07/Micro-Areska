import type { OrderStatus } from '@/lib/constants/order-status'

export interface OrderDetailItem {
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

export interface OrderList {
  id: number
  userId: number
  orderDate: string | null
  status: OrderStatus
  total: number
  pickupMethod: 'store' | 'delivery' | 'shipping'
  updatedAt: string | null
  items: OrderDetailItem[]
}
