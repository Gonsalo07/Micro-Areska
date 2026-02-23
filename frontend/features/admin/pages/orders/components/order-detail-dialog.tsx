'use client'

import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingBag } from 'lucide-react'

import { adminOrdersApi } from '@admin/api/orders'
import { DetailField, DialogSection } from '@admin/components/shared/dialog-section'
import { ResourceDialog } from '@admin/components/shared/resource-dialog'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/constants/order-status'

interface Props {
  open: boolean
  onClose: () => void
  itemId: number
  onUpdateStatus: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value)
}

function parseOrderDate(raw: string | null, long = false): string {
  if (!raw) return '-'
  const [datePart, timePart] = raw.split(' ')
  if (!datePart) return '-'
  const [day, month, year] = datePart.split('-')
  const date = new Date(`${year}-${month}-${day}T${timePart ?? '00:00'}:00`)
  if (isNaN(date.getTime())) return raw
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: long ? 'long' : 'short',
    year: 'numeric',
    ...(long && { hour: '2-digit', minute: '2-digit' }),
  })
}

function formatOrderCode(id: number) {
  return `#${String(id).padStart(6, '0')}`
}

const pickupMethodLabels: Record<string, string> = {
  store: 'Recojo en tienda',
  delivery: 'Delivery',
  shipping: 'Envío',
}

export function OrderDetailDialog({ open, onClose, itemId, onUpdateStatus }: Props) {
  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', itemId],
    queryFn: () => adminOrdersApi.getById(itemId),
    enabled: open,
  })

  return (
    <ResourceDialog
      open={open}
      onClose={onClose}
      mode="detail"
      resourceName="pedido"
      itemName={order ? formatOrderCode(order.id) : undefined}
      isLoading={isLoading}
      onEdit={onUpdateStatus}
      size="2xl"
    >
      <div className="space-y-6">
        <DialogSection columns={2} isLoading={isLoading} skeletonFields={6}>
          {order && (
            <>
              <DetailField label="Código">
                <span className="font-mono font-medium">{formatOrderCode(order.id)}</span>
              </DetailField>

              <DetailField label="Estado">
                <Badge>{ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status}</Badge>
              </DetailField>

              <DetailField label="Método de entrega">
                <span className="text-sm">
                  {pickupMethodLabels[order.pickupMethod] ?? order.pickupMethod}
                </span>
              </DetailField>

              <DetailField label="Total">
                <span className="text-sm font-semibold">{formatCurrency(Number(order.total))}</span>
              </DetailField>

              <DetailField label="Fecha del pedido">
                <span className="text-sm text-muted-foreground">
                  {parseOrderDate(order.orderDate, true)}
                </span>
              </DetailField>

              {order.updatedAt && (
                <DetailField label="Última actualización">
                  <span className="text-sm text-muted-foreground">
                    {parseOrderDate(order.updatedAt, true)}
                  </span>
                </DetailField>
              )}
            </>
          )}
        </DialogSection>

        {order && order.items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Productos ({order.items.length})</h4>
            </div>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">P. Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium">{item.product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{item.quantity}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(Number(item.unitPrice))}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(Number(item.priceTotal))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/30 font-medium">
                    <TableCell colSpan={3} className="text-right text-sm">
                      Total
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold">
                      {formatCurrency(Number(order.total))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </ResourceDialog>
  )
}
