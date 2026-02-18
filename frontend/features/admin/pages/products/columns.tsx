'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye, ImageIcon, Pencil, Tag, Trash2 } from 'lucide-react'

import {
  DataTableRowActions,
  type RowActionItem,
} from '@admin/components/data-table/data-table-row-actions'
import type { ProductList } from '@admin/types/product/product-list'
import { withMetaLabelFilter } from '@admin/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@admin/utils/components/with-meta-label-header'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { FilterOption } from '@/lib/types'

interface ProductColumnCallbacks {
  onDetail?: (product: ProductList) => void
  onEdit?: (product: ProductList) => void
  onDelete?: (product: ProductList) => void
}

type ProductColumnOptions = ProductColumnCallbacks & {
  categories?: FilterOption[]
}

export const getColumns = (options?: ProductColumnOptions): ColumnDef<ProductList>[] => {
  const { onDetail, onEdit, onDelete, categories: categoriesOptions = [] } = options ?? {}

  return [
    {
      accessorKey: 'name',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ getValue, row }) => {
        const name = getValue<string>()
        const imageUrl = row.original.mainImage

        return (
          <div className="flex items-center gap-2">
            <Avatar className="rounded-sm">
              <AvatarImage src={imageUrl || undefined} alt={name} className="object-cover" />
              <AvatarFallback className="rounded-sm">
                <ImageIcon className="size-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        )
      },
      meta: { searchable: true },
    },
    {
      id: 'category',
      accessorFn: (row) => String(row.category?.id ?? ''),
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ row }) => {
        const category = row.original.category?.name ?? 'Sin categoría'
        return (
          <Badge variant="outline">
            <Tag className="mr-1" />
            {category}
          </Badge>
        )
      },
      enableSorting: false,
      meta: withMetaLabelFilter<ProductList>({
        columnId: 'category',
        options: categoriesOptions,
      }),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'price',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ getValue }) => {
        const price = getValue<number>()
        return <span className="font-medium">S/ {price.toFixed(2)}</span>
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'stock',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ getValue }) => {
        const stock = getValue<number>() ?? 0
        return (
          <Badge variant={stock > 0 ? 'secondary' : 'destructive'}>
            {stock} {stock === 1 ? 'und.' : 'unds.'}
          </Badge>
        )
      },
      meta: {
        headerClass: 'text-center',
        cellClass: 'text-center',
      },
    },
    {
      accessorKey: 'badge',
      header: withMetaLabelHeader<ProductList>(),
      cell: ({ getValue }) => {
        const badge = getValue<string | null>()
        if (!badge) return <span className="text-muted-foreground">-</span>
        return <Badge variant="outline">{badge}</Badge>
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const items: RowActionItem[] = [
          {
            icon: Eye,
            label: 'Detalles',
            onClick: () => onDetail?.(row.original),
          },
          {
            icon: Pencil,
            label: 'Editar',
            onClick: () => onEdit?.(row.original),
          },
          {
            icon: Trash2,
            label: 'Eliminar',
            onClick: () => onDelete?.(row.original),
            variant: 'destructive' as const,
          },
        ]
        return <DataTableRowActions items={items} />
      },
    },
  ]
}
