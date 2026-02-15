'use client'

import { useEffect, useState } from 'react'

import { Store } from 'lucide-react'

import { ordersApi } from '@/lib/api/orders'
import { useAuthStore } from '@/stores/auth-store'

type OrderItem = {
  id: number
  product: {
    id: number
    name: string
  }
  quantity: number
  unitPrice: number
  priceTotal: number
}

type Order = {
  id: number
  orderDate: string
  total: number
  status: string
  pickupMethod: string
  items: OrderItem[]
}

export function MyPurchasesPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.firebaseUid) return

    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getByFirebaseUid(user.firebaseUid)
        console.warn('📦 Órdenes recibidas:', data)
        setOrders(data)
      } catch (error) {
        console.error('Error al obtener órdenes:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?.firebaseUid])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Cargando tus compras...
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl text-center py-16">
        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-200">
          Aún no tienes compras registradas
        </h2>
        <p className="text-muted-foreground mt-2">Cuando realices una compra, aparecerá aquí.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-indigo-400">Mis Compras</h1>
      <p className="text-gray-400 text-center mb-8">
        Consulta tu historial de pedidos, estados y detalles de tus compras.
      </p>

      <div className="grid gap-6">
        {orders.map((order) => (
          <article
            key={order.id}
            className="border border-gray-700 bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-indigo-300">Pedido #{order.id}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'completed'
                    ? 'bg-green-900/40 text-green-300'
                    : order.status === 'pending'
                      ? 'bg-yellow-900/40 text-yellow-300'
                      : 'bg-gray-800 text-gray-300'
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-gray-300 text-sm space-y-1">
              <p>
                <span className="text-gray-400">Fecha:</span> {order.orderDate}
              </p>
              <p>
                <span className="text-gray-400">Método:</span> {order.pickupMethod}
              </p>
              <p>
                <span className="text-gray-400">Total:</span>{' '}
                <span className="text-green-400 font-medium">${order.total.toFixed(2)}</span>
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-gray-200 font-semibold">Productos:</h3>
              <ul className="mt-2 ml-4 space-y-1">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="text-gray-400 text-sm flex justify-between border-b border-gray-800 pb-1"
                  >
                    <span>
                      🛒 {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-indigo-400 font-medium">
                      ${item.priceTotal.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
