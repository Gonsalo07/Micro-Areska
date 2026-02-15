import { z } from 'zod'

export const UserDetailResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  firebaseUid: z.string(),
  authProvider: z.string(),
  emailVerified: z.boolean(),
  photoUrl: z.string().nullable(),
  createdAt: z.string(),
})

export const UserListResponseSchema = z.object({
  id: z.number(),
  photoUrl: z.string().nullable(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  authProvider: z.string(),
})

export const FirebaseUserRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must not exceed 255 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must not exceed 255 characters'),
  email: z.string().email('Email must be valid'),
  firebaseUid: z.string().min(1, 'Firebase UID is required'),
  authProvider: z.string().min(1, 'Auth provider is required'),
  emailVerified: z.boolean(),
  photoUrl: z.string().nullable().optional(),
})

export const UpdateUserEmailRequestSchema = z.object({
  email: z.string().email('Email must be valid'),
})

export const UpdateUserPhotoRequestSchema = z.object({
  photoUrl: z.string().max(500, 'Photo URL must not exceed 500 characters').nullable().optional(),
})

export const UpdateUserProfileRequestSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must not exceed 255 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must not exceed 255 characters'),
  phone: z.string().regex(/^9\d{8}$|^$/, 'Phone number must have 9 digits and start with 9'),
  address: z.string().max(255, 'Address must not exceed 255 characters').optional(),
})

export type UserDetailResponse = z.infer<typeof UserDetailResponseSchema>
export type UserListResponse = z.infer<typeof UserListResponseSchema>
export type FirebaseUserRequest = z.infer<typeof FirebaseUserRequestSchema>
export type UpdateUserEmailRequest = z.infer<typeof UpdateUserEmailRequestSchema>
export type UpdateUserPhotoRequest = z.infer<typeof UpdateUserPhotoRequestSchema>
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileRequestSchema>
