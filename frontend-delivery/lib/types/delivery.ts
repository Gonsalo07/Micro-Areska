// Delivery Driver types
export interface DeliveryDriverResponse {
  id: number
  fullName: string
  phone: string | null
  email: string | null
  firebaseUid: string
  authProvider: string
  emailVerified: boolean
  photoUrl: string | null
  vehicleType: string | null
  licenseNumber: string | null
  companyName: string | null
  isAvailable: boolean
  isActive: boolean
  currentLat: number | null
  currentLng: number | null
  lastLocationUpdate: string | null
  createdAt: string
}

export interface DeliveryDriverRequest {
  fullName: string
  phone?: string
  email?: string
  firebaseUid: string
  authProvider: string
  emailVerified?: boolean
  photoUrl?: string
  vehicleType?: string
  licenseNumber?: string
  companyName?: string
}

export interface DeliveryDriverUpdateRequest {
  fullName?: string
  phone?: string
  email?: string
  photoUrl?: string
  vehicleType?: string
  licenseNumber?: string
  companyName?: string
  isAvailable?: boolean
  isActive?: boolean
  currentLat?: number
  currentLng?: number
}

// Notification types
export interface DeliveryDriverNotificationResponse {
  id: number
  deliveryDriverId: number
  orderId: number | null
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export interface DeliveryDriverNotificationRequest {
  deliveryDriverId: number
  orderId?: number
  title: string
  message: string
  type: string
}

// Location update type
export interface LocationUpdate {
  currentLat: number
  currentLng: number
}
