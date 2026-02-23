import type {
  DeliveryDriverRequest,
  DeliveryDriverResponse,
  DeliveryDriverUpdateRequest,
  LocationUpdate,
} from '@/lib/types/delivery'

import { apiClient } from '@/lib/api/client'

const RESOURCE = 'delivery-drivers'

export const deliveryDriverApi = {
  /**
   * Get all delivery drivers
   */
  async getAll() {
    return apiClient.get<DeliveryDriverResponse[]>(`/${RESOURCE}`)
  },

  /**
   * Get delivery driver by ID
   */
  async getById(id: number) {
    return apiClient.get<DeliveryDriverResponse>(`/${RESOURCE}/${id}`)
  },

  /**
   * Get delivery driver by Firebase UID
   */
  async getByFirebaseUid(firebaseUid: string) {
    return apiClient.get<DeliveryDriverResponse>(`/${RESOURCE}/firebase/${firebaseUid}`)
  },

  /**
   * Sync delivery driver with Firebase (create or update)
   */
  async syncWithFirebase(payload: Omit<DeliveryDriverRequest, 'vehicleType' | 'licenseNumber' | 'companyName'>) {
    return apiClient.post<DeliveryDriverResponse>(`/${RESOURCE}/firebase/sync`, payload)
  },

  /**
   * Get all available delivery drivers
   */
  async getAvailable() {
    return apiClient.get<DeliveryDriverResponse[]>(`/${RESOURCE}/available`)
  },

  /**
   * Get delivery drivers by company name
   */
  async getByCompany(companyName: string) {
    return apiClient.get<DeliveryDriverResponse[]>(`/${RESOURCE}/company/${companyName}`)
  },

  /**
   * Create a new delivery driver (registration)
   */
  async create(payload: DeliveryDriverRequest) {
    return apiClient.post<DeliveryDriverResponse>(`/${RESOURCE}`, payload)
  },

  /**
   * Update delivery driver profile
   */
  async update(id: number, payload: DeliveryDriverUpdateRequest) {
    return apiClient.put<DeliveryDriverResponse>(`/${RESOURCE}/${id}`, payload)
  },

  /**
   * Update driver availability status
   */
  async updateAvailability(id: number, isAvailable: boolean) {
    return apiClient.patch<DeliveryDriverResponse>(`/${RESOURCE}/${id}/availability`, { isAvailable })
  },

  /**
   * Update driver location
   */
  async updateLocation(id: number, location: LocationUpdate) {
    return apiClient.put<DeliveryDriverResponse>(`/${RESOURCE}/${id}`, location)
  },

  /**
   * Delete (soft delete) delivery driver
   */
  async delete(id: number) {
    return apiClient.delete<void>(`/${RESOURCE}/${id}`)
  },
}
