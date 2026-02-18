import { z } from 'zod'

export const createCategoryRequestSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .max(100, 'El slug no puede exceder 100 caracteres')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'El slug debe ser en minúsculas, alfanumérico y puede contener guiones'
    ),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .nullable()
    .optional(),
})

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>
