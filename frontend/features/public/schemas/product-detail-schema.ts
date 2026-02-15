import { z } from 'zod'

export const ProductDetailCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const ProductImageItemSchema = z.object({
  imageUrl: z.string(),
  displayOrder: z.number(),
})

export const ProductColorItemSchema = z.object({
  name: z.string(),
  hexValue: z.string(),
  displayOrder: z.number(),
})

export const ProductSizeItemSchema = z.object({
  sizeName: z.string(),
  displayOrder: z.number(),
})

export const ProductFeatureItemSchema = z.object({
  featureText: z.string(),
  displayOrder: z.number(),
})

export const ProductDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  mainImage: z.string(),
  stock: z.number(),
  badge: z.string().optional(),
  category: ProductDetailCategorySchema,
  images: z.array(ProductImageItemSchema).optional(),
  colors: z.array(ProductColorItemSchema).optional(),
  sizes: z.array(ProductSizeItemSchema).optional(),
  features: z.array(ProductFeatureItemSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export type ProductDetail = z.infer<typeof ProductDetailSchema>
