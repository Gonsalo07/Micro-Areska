import { ProductDetail } from '@public/schemas/product-detail-schema'
import { ProductList } from '@public/schemas/product-list-schema'

import { apiClient } from './client'

export const productsApi = {
  async getAll(): Promise<ProductList[]> {
    return apiClient.get<ProductList[]>('/products')
  },

  async getById(id: number): Promise<ProductDetail> {
    return apiClient.get<ProductDetail>(`/products/${id}`)
  },
}
