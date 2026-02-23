'use client'

import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { adminOrdersApi } from '@admin/api/orders'
import { TableListLayout } from '@admin/components/shared/table-list-layout'
import type { OrderList } from '@admin/types/order/order-list'

import { getColumns } from './columns'
import { OrderDetailDialog } from './components/order-detail-dialog'
import { OrderUpdateStatusDialog } from './components/order-update-status-dialog'

interface Props {
  title: string
  pathname: string
  resource: string
}

export function OrdersPage({ title, pathname, resource }: Props) {
  const [detailOrder, setDetailOrder] = useState<OrderList | null>(null)
  const [updateStatusOrder, setUpdateStatusOrder] = useState<OrderList | null>(null)

  const {
    data: orders,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [resource],
    queryFn: adminOrdersApi.getAll,
    refetchOnWindowFocus: false,
  })

  const columns = useMemo(
    () =>
      getColumns({
        onDetail: (order) => setDetailOrder(order),
        onUpdateStatus: (order) => setUpdateStatusOrder(order),
      }),
    []
  )

  const isRefreshingOrFetching = isRefetching || isFetching

  return (
    <>
      <TableListLayout
        resource={resource}
        title={title}
        description="Visualiza y gestiona todos los pedidos del sistema."
        pathname={pathname}
        columns={columns}
        data={orders}
        onRefresh={() => refetch()}
        onRowClick={(order) => setDetailOrder(order)}
        isRefetching={isRefreshingOrFetching}
        showAddButton={false}
      />

      {detailOrder && (
        <OrderDetailDialog
          open
          onClose={() => setDetailOrder(null)}
          itemId={detailOrder.id}
          onUpdateStatus={() => {
            setUpdateStatusOrder(detailOrder)
            setDetailOrder(null)
          }}
        />
      )}

      {updateStatusOrder && (
        <OrderUpdateStatusDialog
          open
          onClose={() => setUpdateStatusOrder(null)}
          itemId={updateStatusOrder.id}
        />
      )}
    </>
  )
}
