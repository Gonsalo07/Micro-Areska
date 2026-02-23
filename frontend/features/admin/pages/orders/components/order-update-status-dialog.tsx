'use client'

import { useCallback } from 'react'

import { adminOrdersApi } from '@admin/api/orders'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'
import { ResourceForm } from '@admin/components/shared/resource-form'
import { useResourceForm } from '@admin/hooks/use-resource-form'
import {
  type UpdateOrderStatusRequest,
  updateOrderStatusSchema,
} from '@admin/schemas/order/update-order-status.schema'
import type { OrderList } from '@admin/types/order/order-list'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@/lib/constants/order-status'

interface Props {
  open: boolean
  onClose: () => void
  itemId: number
}

const defaultValues: UpdateOrderStatusRequest = {
  status: ORDER_STATUS.PENDING,
}

export function OrderUpdateStatusDialog({ open, onClose, itemId }: Props) {
  const fetchFn = useCallback(() => adminOrdersApi.getById(itemId), [itemId])

  const { form, data, isLoading, isSubmitting, error, handleSubmit } = useResourceForm<
    OrderList,
    UpdateOrderStatusRequest,
    OrderList
  >({
    schema: updateOrderStatusSchema,
    defaultValues,
    queryKey: ['orders'],
    fetchFn,
    mapDataToForm: (data) => ({
      status: data.status,
    }),
    onSubmit: async (values) => {
      await adminOrdersApi.updateStatus(itemId, values)
    },
    onSuccess: () => {
      onClose()
      form.reset()
    },
    successMessage: 'Estado del pedido actualizado correctamente',
    errorMessage: 'Error al actualizar el estado del pedido',
  })

  const orderCode = data ? `#${String(data.id).padStart(6, '0')}` : undefined

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="edit"
      resourceName="estado del pedido"
      itemName={orderCode}
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
        fieldCount={1}
        columns={1}
        mode="edit"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado del pedido</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </ResourceForm>
    </ResourceDialog>
  )
}
