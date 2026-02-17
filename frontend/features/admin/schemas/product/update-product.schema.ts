import { z } from 'zod'

export const updateProductRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().nullable().optional(),
  price: z.coerce.number().positive('El precio debe ser positivo'),
  originalPrice: z.coerce
    .number()
    .positive('El precio original debe ser positivo')
    .nullable()
    .optional(),
  mainImage: z.string().max(500, 'La URL de imagen no puede exceder 500 caracteres').optional(),
  stock: z.coerce.number().min(0, 'El stock debe ser mayor o igual a 0').optional().default(0),
  badge: z.string().max(50, 'La etiqueta no puede exceder 50 caracteres').nullable().optional(),
  categoryId: z.coerce.number().min(1, 'La categoría es requerida'),
})

export type UpdateProductRequest = z.infer<typeof updateProductRequestSchema>
