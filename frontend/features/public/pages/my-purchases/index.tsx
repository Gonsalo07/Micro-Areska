'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { MapPin, MessageCircle, Package, Store, Truck, User } from 'lucide-react'

import {
  getDeliveryStatusColor,
  getDeliveryStatusLabel,
  getOrderStatusColor,
  getOrderStatusLabel,
} from '@/lib/constants/order-status'
import { useAuthStore } from '@auth/stores/auth.store'
import { deliveryApi, type OrderDeliveryDetail } from '@public/api/delivery'
import { ordersApi, type OrderResponse } from '@public/api/orders'

// Tipo extendido para orden con su detalle de delivery
type OrderWithDelivery = OrderResponse & {
  deliveryDetail?: OrderDeliveryDetail | null
}

export function MyPurchasesPage() {
  const profile = useAuthStore((s) => s.profile)
  const [orders, setOrders] = useState<OrderWithDelivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.firebaseUid) return

    const fetchOrders = async () => {
      try {
        const data = await ordersApi.getByFirebaseUid(profile.firebaseUid)
        
        // Para órdenes con delivery, obtener el detalle de entrega
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
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-indigo-400">
        Mis Compras
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
        Consulta tu historial de pedidos, estados y detalles de tus compras.
      </p>

      <div className="grid gap-6">
        {orders.map((order) => (
          <article
            key={order.id}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-indigo-300">
                    Pedido #{order.id}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.orderDate}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>

            <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2 mb-4">
              <p className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Método de entrega:</span>
                <span className="font-medium">
                  {order.pickupMethod === 'delivery' ? '🚚 Envío a domicilio' : '🏪 Recoger en tienda'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <span className="text-green-600 dark:text-green-400 font-semibold text-base">
                  S/ {order.total.toFixed(2)}
                </span>
              </p>
            </div>

            {/* Sección de entrega */}
            {order.pickupMethod === 'delivery' && order.deliveryDetail && (
              <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium text-indigo-700 dark:text-indigo-300">
                      Estado de Entrega
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(order.deliveryDetail.status)}`}
                  >
                    {getDeliveryStatusLabel(order.deliveryDetail.status)}
                  </span>
                </div>

                {/* Info del repartidor si está asignado */}
                {order.deliveryDetail.driverName && (
                  <div className="flex items-center gap-3 mb-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                      <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {order.deliveryDetail.driverName}
                      </p>
                      {order.deliveryDetail.driverPhone && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.deliveryDetail.driverPhone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dirección de entrega */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">Dirección:</span> {order.deliveryDetail.destinationAddress}
                  {order.deliveryDetail.destinationReference && (
                    <span className="text-gray-500"> ({order.deliveryDetail.destinationReference})</span>
                  )}
                </p>
                
                {/* Timestamps de seguimiento */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {order.deliveryDetail.assignedAt && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Asignado:</span> {order.deliveryDetail.assignedAt}
                    </p>
                  )}
                  {order.deliveryDetail.acceptedAt && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Aceptado:</span> {order.deliveryDetail.acceptedAt}
                    </p>
                  )}
                  {order.deliveryDetail.pickedUpAt && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Recogido:</span> {order.deliveryDetail.pickedUpAt}
                    </p>
                  )}
                  {order.deliveryDetail.outForDeliveryAt && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">En camino:</span> {order.deliveryDetail.outForDeliveryAt}
                    </p>
                  )}
                  {order.deliveryDetail.arrivedAt && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Llegó:</span> {order.deliveryDetail.arrivedAt}
                    </p>
                  )}
                  {order.deliveryDetail.deliveredAt && (
                    <p className="text-green-600 dark:text-green-400 font-medium col-span-2">
                      ✓ Entregado: {order.deliveryDetail.deliveredAt}
                    </p>
                  )}
                  {order.deliveryDetail.cancelledAt && (
                    <p className="text-red-600 dark:text-red-400 font-medium col-span-2">
                      ✗ Cancelado: {order.deliveryDetail.cancelledAt}
                      {order.deliveryDetail.cancellationReason && (
                        <span className="font-normal"> - {order.deliveryDetail.cancellationReason}</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Botón de seguimiento en vivo */}
                {['OUT_FOR_DELIVERY', 'ARRIVED'].includes(order.deliveryDetail.status) && (
                  <Link href={`/mis-compras/seguimiento/${order.id}`}>
                    <Button
                      className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      <MessageCircle className="h-4 w-4" />
                      Ver Seguimiento en Vivo
                    </Button>
                  </Link>
                )}
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">Productos:</h3>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="text-gray-600 dark:text-gray-400 text-sm flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🛒</span>
                      <span>
                        {item.productName} <span className="text-gray-400">× {item.quantity}</span>
                      </span>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      S/ {item.priceTotal.toFixed(2)}
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
