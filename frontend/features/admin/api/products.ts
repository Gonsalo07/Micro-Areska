import type { CreateProductRequest } from '@admin/schemas/product/create-product.schema'
import type { UpdateProductRequest } from '@admin/schemas/product/update-product.schema'
import type { UpdateProductStockRequest } from '@admin/schemas/product/update-product-stock.schema'
import type { ProductList } from '@admin/types/product/product-list'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'products'

export const adminProductsApi = {
  async getAll() {
    return apiClient.get<ProductList[]>(`/${RESOURCE}`)
  },

  async getById(id: number) {
    return apiClient.get<ProductList>(`/${RESOURCE}/${id}`)
  },

  async getByCategoryId(categoryId: number) {
    return apiClient.get<ProductList[]>(`/${RESOURCE}/category/${categoryId}`)
  },

  async create(request: CreateProductRequest) {
    return apiClient.post<ProductList>(`/${RESOURCE}`, request)
  },

  async update(id: number, request: UpdateProductRequest) {
    return apiClient.put<ProductList>(`/${RESOURCE}/${id}`, request)
  },

  async updateStock(id: number, request: UpdateProductStockRequest) {
    return apiClient.put<void>(`/${RESOURCE}/${id}/stock`, request)
  },

  async delete(id: number) {
    await apiClient.delete(`/${RESOURCE}/${id}`)
  },
}
