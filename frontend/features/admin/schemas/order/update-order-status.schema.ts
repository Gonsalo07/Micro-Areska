import { z } from 'zod'

import { ORDER_STATUS } from '@/lib/constants/order-status'

export const updateOrderStatusSchema = z.object({
  status: z.enum(
    [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED,
    ],
    { message: 'El estado es requerido' }
  ),
})

export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>
