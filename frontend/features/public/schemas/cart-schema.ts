import { z } from 'zod'

export const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string(),
  quantity: z.number().min(1),
})

export type CartItem = z.infer<typeof CartItemSchema>
