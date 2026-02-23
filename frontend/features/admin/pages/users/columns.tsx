'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'

import {
  DataTableRowActions,
  type RowActionItem,
} from '@admin/components/data-table/data-table-row-actions'
import type { UserList } from '@admin/types/user/user-list'
import { withMetaLabelFilter } from '@admin/utils/components/with-meta-label-filter'
import { withMetaLabelHeader } from '@admin/utils/components/with-meta-label-header'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { FilterOption } from '@/lib/types'
import { getInitials } from '@/lib/utils'

const authProviderFilterOptions: FilterOption[] = [
  { label: 'Google', value: 'google.com' },
  { label: 'Email / Password', value: 'password' },
]

const authProviderLabels: Record<string, string> = {
  'google.com': 'Google',
  password: 'Email / Password',
}

interface UserColumnCallbacks {
  onDetail?: (user: UserList) => void
}

export const getColumns = (options?: UserColumnCallbacks): ColumnDef<UserList>[] => {
  const { onDetail } = options ?? {}

  return [
    {
      id: 'fullName',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`.trim(),
      header: withMetaLabelHeader<UserList>(),
      cell: ({ getValue, row }) => {
        const fullName = getValue<string>()
        const { firstName, lastName, photoUrl } = row.original
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={photoUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="text-xs">
                {getInitials(firstName, lastName)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{fullName}</span>
          </div>
        )
      },
      meta: { searchable: true },
    },
    {
      accessorKey: 'role',
      header: withMetaLabelHeader<UserList>(),
      cell: ({ getValue }) => {
        const role = getValue<string | null>()
        return role ? (
          <Badge variant="secondary" className="text-xs capitalize">
            {role.toLowerCase()}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: withMetaLabelHeader<UserList>(),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: withMetaLabelHeader<UserList>(),
      cell: ({ getValue }) => {
        const phone = getValue<string | null>()
        return phone ? (
          <span className="text-sm">{phone}</span>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'authProvider',
      header: withMetaLabelHeader<UserList>(),
      cell: ({ getValue }) => {
        const provider = getValue<string>()
        return (
          <Badge variant="outline" className="text-xs">
            {authProviderLabels[provider] ?? provider}
          </Badge>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      meta: withMetaLabelFilter<UserList>({
        columnId: 'authProvider',
        options: authProviderFilterOptions,
      }),
      enableSorting: false,
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
        ]
        return <DataTableRowActions items={items} />
      },
    },
  ]
}
