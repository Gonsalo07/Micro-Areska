'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye, FolderOpen, Pencil } from 'lucide-react'

import {
  DataTableRowActions,
  type RowActionItem,
} from '@admin/components/data-table/data-table-row-actions'
import type { CategoryList } from '@admin/types/category/category-list'
import { withMetaLabelHeader } from '@admin/utils/components/with-meta-label-header'

import { Badge } from '@/components/ui/badge'

interface CategoryColumnCallbacks {
  onDetail?: (category: CategoryList) => void
  onEdit?: (category: CategoryList) => void
}

export const getColumns = (options?: CategoryColumnCallbacks): ColumnDef<CategoryList>[] => {
  const { onDetail, onEdit } = options ?? {}

  return [
    {
      accessorKey: 'name',
      header: withMetaLabelHeader<CategoryList>(),
      cell: ({ getValue }) => {
        const name = getValue<string>()
        return (
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{name}</span>
          </div>
        )
      },
      meta: { searchable: true },
    },
    {
      accessorKey: 'slug',
      header: withMetaLabelHeader<CategoryList>(),
      cell: ({ getValue }) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: 'description',
      header: withMetaLabelHeader<CategoryList>(),
      cell: ({ getValue }) => {
        const description = getValue<string | null>()
        return description ? (
          <span className="truncate max-w-64 block text-sm">{description}</span>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: withMetaLabelHeader<CategoryList>(),
      cell: ({ getValue }) => {
        const date = getValue<string>()
        return (
          <span className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )
      },
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
        ]
        return <DataTableRowActions items={items} />
      },
    },
  ]
}
