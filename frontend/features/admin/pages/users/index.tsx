'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { adminUsersApi } from '@admin/api/users'
import { TableListLayout } from '@admin/components/shared/table-list-layout'
import type { UserList } from '@admin/types/user/user-list'

import { getColumns } from './columns'
import { UserDetailDialog } from './components/user-detail-dialog'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function UsersPage({ title, pathname, resource }: Props) {
  const [detailUser, setDetailUser] = useState<UserList | null>(null)

  const {
    data: users,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [resource],
    queryFn: adminUsersApi.getAll,
    refetchOnWindowFocus: false,
  })

  const columns = useMemo(
    () =>
      getColumns({
        onDetail: (user) => setDetailUser(user),
      }),
    []
  )

  const isRefreshingOrFetching = isRefetching || isFetching

  return (
    <>
      <TableListLayout
        resource={resource}
        title={title}
        description="Consulta todos los usuarios registrados en el sistema."
        pathname={pathname}
        columns={columns}
        data={users}
        onRefresh={() => refetch()}
        onRowClick={(user) => setDetailUser(user)}
        isRefetching={isRefreshingOrFetching}
        showAddButton={false}
      />

      {detailUser && (
        <UserDetailDialog open onClose={() => setDetailUser(null)} itemId={detailUser.id} />
      )}
    </>
  )
}
