'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil } from 'lucide-react'

import {
  DataTableRowActions,
  type RowActionItem,
} from '@admin/components/data-table/data-table-row-actions'
import type { OrderList } from '@admin/types/order/order-list'
import { withMetaLabelFilter } from '@admin/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@admin/utils/components/with-meta-label-header'

import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS, ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/constants/order-status'
import type { FilterOption } from '@/lib/types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value)
}

function parseOrderDate(raw: string | null): string {
  if (!raw) return '-'
  const [datePart, timePart] = raw.split(' ')
  if (!datePart) return '-'
  const [day, month, year] = datePart.split('-')
  const iso = `${year}-${month}-${day}T${timePart ?? '00:00'}:00`
  const date = new Date(iso)
  if (isNaN(date.getTime())) return raw
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const statusVariantMap: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [ORDER_STATUS.PENDING]: 'outline',
  [ORDER_STATUS.CONFIRMED]: 'secondary',
  [ORDER_STATUS.PREPARING]: 'secondary',
  [ORDER_STATUS.READY]: 'default',
  [ORDER_STATUS.COMPLETED]: 'default',
  [ORDER_STATUS.CANCELLED]: 'destructive',
}

const statusFilterOptions: FilterOption[] = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
)

const pickupMethodLabels: Record<string, string> = {
  store: 'Recojo en tienda',
  delivery: 'Delivery',
  shipping: 'Envío',
}

interface OrderColumnCallbacks {
  onDetail?: (order: OrderList) => void
  onUpdateStatus?: (order: OrderList) => void
}

export const getColumns = (options?: OrderColumnCallbacks): ColumnDef<OrderList>[] => {
  const { onDetail, onUpdateStatus } = options ?? {}

  return [
    {
      id: 'code',
      accessorFn: (row) => `#${String(row.id).padStart(6, '0')}`,
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => (
        <span className="font-mono font-medium text-sm">{getValue<string>()}</span>
      ),
      meta: { searchable: true },
    },
    {
      accessorKey: 'status',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => {
        const status = getValue<OrderStatus>()
        return (
          <Badge variant={statusVariantMap[status] ?? 'outline'}>
            {ORDER_STATUS_LABELS[status] ?? status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      meta: withMetaLabelFilter<OrderList>({
        columnId: 'status',
        options: statusFilterOptions,
      }),
    },
    {
      accessorKey: 'total',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => (
        <span className="font-medium">{formatCurrency(Number(getValue<number>()))}</span>
      ),
    },
    {
      id: 'itemCount',
      accessorFn: (row) => row.items?.length ?? 0,
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => {
        const count = getValue<number>()
        return (
          <Badge variant="outline">
            {count} {count === 1 ? 'item' : 'items'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'pickupMethod',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => (
        <span className="text-sm">
          {pickupMethodLabels[getValue<string>()] ?? getValue<string>()}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'orderDate',
      header: withMetaLabelHeader<OrderList>(),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {parseOrderDate(getValue<string | null>())}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const items: RowActionItem[] = [
          {
            icon: Eye,
            label: 'Ver detalles',
            onClick: () => onDetail?.(row.original),
          },
          {
            icon: Pencil,
            label: 'Cambiar estado',
            onClick: () => onUpdateStatus?.(row.original),
          },
        ]
        return <DataTableRowActions items={items} />
      },
    },
  ]
}
