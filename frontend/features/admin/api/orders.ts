import type { UpdateOrderStatusRequest } from '@admin/schemas/order/update-order-status.schema'
import type { OrderList } from '@admin/types/order/order-list'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'orders'

export const adminOrdersApi = {
  async getAll() {
    return apiClient.get<OrderList[]>(`/${RESOURCE}`)
  },

  async getById(id: number) {
    return apiClient.get<OrderList>(`/${RESOURCE}/${id}`)
  },

  async updateStatus(id: number, request: UpdateOrderStatusRequest) {
    return apiClient.put<OrderList>(`/${RESOURCE}/${id}`, request)
  },
}
