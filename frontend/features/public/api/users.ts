import type {
  FirebaseUserRequest,
  UpdateUserEmailRequest,
  UpdateUserPhotoRequest,
  UpdateUserProfileRequest,
  UserDetailResponse,
  UserListResponse,
} from '@public/schemas/user-schema'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'users'

export const usersApi = {
  async getAll() {
    return apiClient.get<UserListResponse[]>(`/${RESOURCE}`)
  },

  async getById(id: number) {
    return apiClient.get<UserDetailResponse>(`/${RESOURCE}/${id}`)
  },

  async getByFirebaseUid(firebaseUid: string) {
    return apiClient.get<UserDetailResponse>(`/${RESOURCE}/firebase/${firebaseUid}`)
  },

  async syncWithFirebase(payload: FirebaseUserRequest) {
    return apiClient.post<UserDetailResponse>(`/${RESOURCE}/firebase/sync`, payload)
  },

  async updateEmail(firebaseUid: string, payload: UpdateUserEmailRequest) {
    return apiClient.put<UserDetailResponse>(`/${RESOURCE}/${firebaseUid}/email`, payload)
  },

  async updateProfile(firebaseUid: string, payload: UpdateUserProfileRequest) {
    return apiClient.put<UserDetailResponse>(`/${RESOURCE}/${firebaseUid}/profile`, payload)
  },

  async updatePhoto(firebaseUid: string, payload: UpdateUserPhotoRequest) {
    return apiClient.put<UserDetailResponse>(`/${RESOURCE}/${firebaseUid}/photo`, payload)
  },
}
