import { z } from 'zod'

export const ProductListCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const ProductListSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  mainImage: z.string(),
  badge: z.string().optional(),
  category: ProductListCategorySchema,
  createdAt: z.string(),
})

export type ProductList = z.infer<typeof ProductListSchema>
