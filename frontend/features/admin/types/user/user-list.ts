export interface UserList {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  photoUrl: string | null
  authProvider: string
  role?: string | null
}

export interface UserDetail {
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
  role: string
  createdAt: string
}
