'use client'

import { adminCategoriesApi } from '@admin/api/categories'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { ResourceForm } from '@admin/components/shared/resource-form'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import {
  type CreateCategoryRequest,
  createCategoryRequestSchema,
} from '@admin/schemas/category/create-category.schema'
import type { CategoryList } from '@admin/types/category/category-list'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onClose: () => void
}

const defaultValues: CreateCategoryRequest = {
  name: '',
  slug: '',
  description: '',
}

export function CategoryCreateDialog({ open, onClose }: Props) {
  const { form, isLoading, isSubmitting, error, handleSubmit } = useResourceForm<
    CategoryList,
    CreateCategoryRequest,
    CategoryList
  >({
    schema: createCategoryRequestSchema,
    defaultValues,
    queryKey: ['categories'],
    onSubmit: async (values) => {
      await adminCategoriesApi.create(values)
    },
    onSuccess: () => {
      onClose()
      form.reset(defaultValues)
    },
    successMessage: 'Categoría creada correctamente',
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    form.setValue('name', name)
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    form.setValue('slug', slug, { shouldValidate: true })
  }

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="create"
      resourceName="categoría"
      isLoading={isLoading}
      onDiscard={() => {
        form.reset(defaultValues)
        onClose()
      }}
    >
      <ResourceForm
        form={form}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => {
          form.reset(defaultValues)
          onClose()
        }}
        fieldCount={3}
        columns={1}
        mode="create"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ropa deportiva" {...field} onChange={handleNameChange} />
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
