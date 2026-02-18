export type UserRole = 'CLIENTE' | 'ADMIN'

export interface UserProfile {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  address: string | null
  firebaseUid: string
  authProvider: string
  emailVerified: boolean
  photoUrl: string | null
  role: UserRole
  createdAt: string
}
