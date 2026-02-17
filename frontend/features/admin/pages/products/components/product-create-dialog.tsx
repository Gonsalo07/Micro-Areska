'use client'

import { useQuery } from '@tanstack/react-query'

import { adminCategoriesApi } from '@admin/api/categories'
import { adminProductsApi } from '@admin/api/products'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { ResourceForm } from '@admin/components/shared/resource-form'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import {
  type CreateProductRequest,
  createProductRequestSchema,
} from '@admin/schemas/product/create-product.schema'
import type { ProductList } from '@admin/types/product/product-list'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onClose: () => void
}

const defaultValues: CreateProductRequest = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: 0,
  mainImage: '',
  badge: '',
}

export function ProductCreateDialog({ open, onClose }: Props) {
  const { form, isLoading, isSubmitting, error, handleSubmit } = useResourceForm<
    ProductList,
    CreateProductRequest,
    ProductList
  >({
    schema: createProductRequestSchema,
    defaultValues,
    queryKey: ['products'],
    onSubmit: async (values) => {
      await adminProductsApi.create(values)
    },
    onSuccess: () => {
      onClose()
      form.reset(defaultValues)
    },
    successMessage: 'Producto creado correctamente',
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: adminCategoriesApi.getAll,
  })

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="create"
      resourceName="producto"
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
        fieldCount={6}
        columns={2}
        mode="create"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del producto" {...field} />
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
                  placeholder="Descripción del producto"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Nuevo, Oferta" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mainImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ResourceForm>
    </ResourceDialog>
  )
}
