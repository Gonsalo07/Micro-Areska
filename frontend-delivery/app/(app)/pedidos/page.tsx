'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardBody, Chip, Spinner } from '@nextui-org/react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { orderDeliveriesApi } from '@/features/delivery/api/order-deliveries'
import type { OrderDeliveryDetailResponse } from '@/lib/types/order'

export default function PedidosPage() {
  const { driver } = useAuthStore()
  const [orders, setOrders] = useState<OrderDeliveryDetailResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<number | null>(null)

  const fetchPending = useCallback(async () => {
    try {
      const data = await orderDeliveriesApi.getPendingAssignment()
      setOrders(data)
    } catch {
      // silenciar
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar al montar y cada 15 segundos
  useEffect(() => {
    fetchPending()
    const interval = setInterval(fetchPending, 15_000)
    return () => clearInterval(interval)
  }, [fetchPending])

  const handleAccept = async (deliveryId: number) => {
    if (!driver?.id) return
    setAccepting(deliveryId)
    const result = await orderDeliveriesApi.acceptOrder(deliveryId, driver.id)
    if (result === null) {
      // Ya fue tomada — refrescar lista
      await fetchPending()
    } else {
      window.location.href = '/en-ruta'
    }
    setAccepting(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📦 Órdenes disponibles</h1>
          <p className="text-default-500 text-sm">Estas órdenes están esperando un repartidor</p>
        </div>
        <Button
          size="sm"
          variant="flat"
          onPress={fetchPending}
          isDisabled={loading}
        >
          🔄 Actualizar
        </Button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Cargando órdenes..." />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center py-12 gap-3 text-center">
            <span className="text-5xl">🛵</span>
            <p className="text-lg font-semibold text-default-600">No hay órdenes pendientes</p>
            <p className="text-sm text-default-400">
              Las nuevas órdenes aparecerán aquí automáticamente
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border border-primary/30 hover:border-primary transition-colors"
            >
              <CardBody className="p-4 gap-3">
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <div>
                      <p className="font-semibold text-sm">Orden #{order.orderId}</p>
                      <Chip size="sm" color="warning" variant="flat">
                        Pendiente de asignar
                      </Chip>
                    </div>
                  </div>
                  <p className="text-xs text-default-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>

                {/* Detalles */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-default-400">👤</span>
                    <span className="font-medium">{order.customerName}</span>
                    {order.customerPhone && (
                      <span className="text-default-400">· {order.customerPhone}</span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-default-400 shrink-0 mt-0.5">📍</span>
                    <span className="text-default-700">{order.destinationAddress}</span>
                  </div>
                  {order.customerNotes && (
                    <div className="flex items-start gap-2">
                      <span className="text-default-400 shrink-0 mt-0.5">📝</span>
                      <span className="text-default-500 italic text-xs">{order.customerNotes}</span>
                    </div>
                  )}
                </div>

                {/* Botón */}
                <Button
                  color="primary"
                  fullWidth
                  onPress={() => handleAccept(order.id)}
                  isLoading={accepting === order.id}
                  isDisabled={accepting !== null}
                >
                  ✅ Aceptar esta orden
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
