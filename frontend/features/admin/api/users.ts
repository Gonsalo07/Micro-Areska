import type { UserDetail, UserList } from '@admin/types/user/user-list'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'users'

export const adminUsersApi = {
  async getAll() {
    return apiClient.get<UserList[]>(`/${RESOURCE}`)
  },

  async getById(id: number) {
    return apiClient.get<UserDetail>(`/${RESOURCE}/${id}`)
  },
}
