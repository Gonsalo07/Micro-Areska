import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  address: z.string().optional(),
  createdAt: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>
