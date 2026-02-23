import { ProductDetail } from '@public/schemas/product-detail-schema'
import { ProductList } from '@public/schemas/product-list-schema'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'products'

export const productsApi = {
  async getAll() {
    return apiClient.get<ProductList[]>(`/${RESOURCE}`, {
      authenticated: false,
    })
  },

  async getById(id: number) {
    return apiClient.get<ProductDetail>(`/${RESOURCE}/${id}`, {
      authenticated: false,
    })
  },
}
