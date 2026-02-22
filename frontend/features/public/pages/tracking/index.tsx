'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, MessageCircle, Package, Truck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DeliveryMap } from '@/components/tracking/delivery-map'
import { CustomerChat } from '@/components/tracking/customer-chat'
import { useAuthStore } from '@auth/stores/auth.store'
import { deliveryApi, type OrderDeliveryDetail } from '@public/api/delivery'
import { ordersApi, type OrderResponse } from '@public/api/orders'
import {
  getDeliveryStatusColor,
  getDeliveryStatusLabel,
} from '@/lib/constants/order-status'

const ACTIVE_STATUSES = ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED']
const CHAT_ENABLED_STATUSES = ['OUT_FOR_DELIVERY', 'ARRIVED']

export function TrackingPage() {
  const params = useParams()
  const router = useRouter()
  const profile = useAuthStore((s) => s.profile)
  
  const orderId = parseInt(params.orderId as string)
  
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [delivery, setDelivery] = useState<OrderDeliveryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isChatEnabled = delivery ? CHAT_ENABLED_STATUSES.includes(delivery.status) : false

  const fetchOrderAndDelivery = useCallback(async () => {
    if (!orderId || !profile?.firebaseUid) return

    try {
      // Obtener la orden
      const orderData = await ordersApi.getById(orderId)
      
      // Nota: La validación de permisos ya se hace en el Gateway
      // El Gateway valida el token de Firebase y el acceso a la orden
      // if (orderData.firebaseUid !== profile.firebaseUid) {
      //   setError('No tienes permiso para ver este pedido')
      //   return
      // }

      setOrder(orderData)

      // Si es delivery, obtener el detalle
      if (orderData.pickupMethod === 'delivery') {
        const deliveryData = await deliveryApi.getByOrderId(orderId)
        setDelivery(deliveryData)

        // Si ya no está activa, redirigir a mis compras
        if (deliveryData && !ACTIVE_STATUSES.includes(deliveryData.status)) {
          setTimeout(() => {
            router.push('/mis-compras')
          }, 3000)
        }
      }
    } catch (err) {
      console.error('Error fetching order/delivery:', err)
      setError('No se pudo cargar la información del pedido')
    } finally {
      setLoading(false)
    }
  }, [orderId, profile?.firebaseUid, router])

  useEffect(() => {
    fetchOrderAndDelivery()

    // Polling cada 15 segundos para actualizar el estado
    const interval = setInterval(fetchOrderAndDelivery, 15000)
    return () => clearInterval(interval)
  }, [fetchOrderAndDelivery])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Pedido no encontrado'}</p>
          <Button onClick={() => router.push('/mis-compras')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Compras
          </Button>
        </div>
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Este pedido no tiene información de entrega
          </p>
          <Button onClick={() => router.push('/mis-compras')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Compras
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/mis-compras')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Compras
          </Button>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Pedido #{order.id}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.orderDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getDeliveryStatusColor(delivery.status)}`}
                >
                  {getDeliveryStatusLabel(delivery.status)}
                </span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  S/ {order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                <span>Asignado</span>
                <span>Aceptado</span>
                <span>Recogido</span>
                <span>En camino</span>
                <span>Entregado</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: delivery.status === 'ASSIGNED' ? '20%' :
                           delivery.status === 'ACCEPTED' ? '40%' :
                           delivery.status === 'PICKED_UP' ? '60%' :
                           delivery.status === 'OUT_FOR_DELIVERY' ? '80%' :
                           delivery.status === 'ARRIVED' ? '95%' :
                           delivery.status === 'DELIVERED' ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content - Mapa y Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa - 2 columnas en desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Ubicación en Tiempo Real
                </h2>
              </div>
              <DeliveryMap delivery={delivery} />
            </div>
          </div>

          {/* Chat - 1 columna en desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Chat con Repartidor
                </h2>
              </div>
              <CustomerChat orderId={orderId} isEnabled={isChatEnabled} />
            </div>
          </div>
        </div>

        {/* Productos del pedido */}
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Productos en este pedido
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛒</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{item.productName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  S/ {item.priceTotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
