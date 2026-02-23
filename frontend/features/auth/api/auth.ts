import type { UserProfile } from '@auth/types/user-profile'

import { apiClient } from '@/lib/api/client'

export interface SyncUserRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  firebaseUid: string
  authProvider: string
  emailVerified: boolean
  photoUrl?: string | null
}

export const authApi = {
  async me(): Promise<UserProfile | null> {
    try {
      return await apiClient.get<UserProfile>('/users/me')
    } catch {
      return null
    }
  },

  async getByFirebaseUid(firebaseUid: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/users/firebase/${firebaseUid}`)
  },

  async sync(request: SyncUserRequest): Promise<UserProfile> {
    return apiClient.post<UserProfile>('/users/firebase/sync', request)
  },

  async updateProfile(
    firebaseUid: string,
    data: {
      firstName: string
      lastName: string
      phone: string
      address?: string
    }
  ): Promise<UserProfile> {
    return apiClient.put<UserProfile>(`/users/${firebaseUid}/profile`, data)
  },
}
