import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  createdAt: z.string(),
})

export type Category = z.infer<typeof CategorySchema>
