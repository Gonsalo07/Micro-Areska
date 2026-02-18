import type { CreateCategoryRequest } from '@admin/schemas/category/create-category.schema'
import type { UpdateCategoryRequest } from '@admin/schemas/category/update-category.schema'
import type { CategoryList } from '@admin/types/category/category-list'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'categories'

export const adminCategoriesApi = {
  async getAll() {
    return apiClient.get<CategoryList[]>(`/${RESOURCE}`)
  },

  async getById(id: number) {
    return apiClient.get<CategoryList>(`/${RESOURCE}/${id}`)
  },

  async create(request: CreateCategoryRequest) {
    return apiClient.post<CategoryList>(`/${RESOURCE}`, request)
  },

  async update(id: number, request: UpdateCategoryRequest) {
    return apiClient.put<CategoryList>(`/${RESOURCE}/${id}`, request)
  },
}
