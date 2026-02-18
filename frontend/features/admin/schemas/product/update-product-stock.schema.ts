import { z } from 'zod'

export const updateProductStockSchema = z.object({
  stock: z.coerce.number().min(0, 'El stock debe ser mayor o igual a 0'),
})

export type UpdateProductStockRequest = z.infer<typeof updateProductStockSchema>
