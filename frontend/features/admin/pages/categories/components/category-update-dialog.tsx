'use client'

import { useCallback } from 'react'

import { adminCategoriesApi } from '@admin/api/categories'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { ResourceForm } from '@admin/components/shared/resource-form'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import {
  type UpdateCategoryRequest,
  updateCategoryRequestSchema,
} from '@admin/schemas/category/update-category.schema'
import type { CategoryList } from '@admin/types/category/category-list'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onClose: () => void
  itemId: number
}

const defaultValues: UpdateCategoryRequest = {
  name: '',
  slug: '',
  description: '',
}

export function CategoryUpdateDialog({ open, onClose, itemId }: Props) {
  const fetchFn = useCallback(() => adminCategoriesApi.getById(itemId), [itemId])

  const { form, data, isLoading, isSubmitting, error, handleSubmit } = useResourceForm<
    CategoryList,
    UpdateCategoryRequest,
    CategoryList
  >({
    schema: updateCategoryRequestSchema,
    defaultValues,
    queryKey: ['categories'],
    fetchFn,
    mapDataToForm: (data) => ({
      name: data.name,
      slug: data.slug,
      description: data.description,
    }),
    onSubmit: async (values) => {
      await adminCategoriesApi.update(itemId, values)
    },
    onSuccess: () => {
      onClose()
      form.reset()
    },
    successMessage: 'Categoría actualizada correctamente',
  })

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="edit"
      resourceName="categoría"
      itemName={data?.name}
      isLoading={isLoading}
      onDiscard={() => {
        form.reset()
        onClose()
      }}
    >
      <ResourceForm
        form={form}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={handleSubmit}
        onCancel={onClose}
        fieldCount={3}
        columns={1}
        mode="edit"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ropa deportiva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="ropa-deportiva" className="font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la categoría (opcional)"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ResourceForm>
    </ResourceDialog>
  )
}
