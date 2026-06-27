'use client'

import { useEffect, useState } from 'react'

import { ShoppingBag, Store } from 'lucide-react'

import { useAuthStore } from '@auth/stores/auth.store'
import { deliveryApi, type OrderDeliveryDetail } from '@public/api/delivery'
import { type OrderResponse, ordersApi } from '@public/api/orders'

import { EmptyState } from '@/components/shared/empty-state'
import { Spinner } from '@/components/ui/spinner'

import { OrderCard } from './order-card'

type OrderWithDelivery = OrderResponse & {
  deliveryDetail?: OrderDeliveryDetail | null
}

export function MyPurchasesPage() {
  const profile = useAuthStore((s) => s.profile)
  const [orders, setOrders] = useState<OrderWithDelivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.firebaseUid) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getByFirebaseUid(profile.firebaseUid)

        const ordersWithDelivery = await Promise.all(
          data.map(async (order) => {
            if (order.pickupMethod === 'delivery') {
              const deliveryDetail = await deliveryApi.getByOrderId(order.id)
              return { ...order, deliveryDetail }
            }
            return { ...order, deliveryDetail: null }
          })
        )

        setOrders(ordersWithDelivery)
      } catch (error) {
        console.error('Error al obtener órdenes:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [profile?.firebaseUid])

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-5" />
        <span>Cargando tus compras...</span>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes compras registradas"
        description="Cuando realices una compra, aparecerá aquí."
        icon={Store}
        action={{
          label: 'Ir a la tienda',
          href: '/productos',
          icon: ShoppingBag,
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mis compras</h1>
        <p className="mt-2 text-muted-foreground">
          Consulta tu historial de pedidos, estados y detalles de tus compras.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
