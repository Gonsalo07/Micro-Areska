'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardBody, Chip, Spinner, Badge } from '@nextui-org/react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { orderDeliveriesApi } from '@/features/delivery/api/order-deliveries'
import type { OrderDeliveryDetailResponse } from '@/lib/types/order'

export default function PedidosPage() {
  const { driver } = useAuthStore()
  const [orders, setOrders] = useState<OrderDeliveryDetailResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<number | null>(null)
  const [activeOrder, setActiveOrder] = useState<OrderDeliveryDetailResponse | null>(null)

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

  const fetchActiveOrder = useCallback(async () => {
    if (!driver?.id) return
    try {
      const actives = await orderDeliveriesApi.getActiveByDriverId(driver.id)
      const inProgress = actives.find((o) =>
        ['ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED'].includes(o.status as string)
      )
      setActiveOrder(inProgress ?? null)
    } catch {
      setActiveOrder(null)
    }
  }, [driver?.id])

  useEffect(() => {
    fetchPending()
    fetchActiveOrder()
    const interval = setInterval(() => {
      fetchPending()
      fetchActiveOrder()
    }, 15_000)
    return () => clearInterval(interval)
  }, [fetchPending, fetchActiveOrder])

  const handleAccept = async (deliveryId: number) => {
    if (!driver?.id) return
    if (activeOrder) return
    setAccepting(deliveryId)
    const result = await orderDeliveriesApi.acceptOrder(deliveryId, driver.id)
    if (result === null) {
      await fetchPending()
    } else {
      window.location.href = '/en-ruta'
    }
    setAccepting(null)
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-default-50 to-background px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Órdenes disponibles</h1>
            <p className="text-default-400 text-sm mt-0.5">
              {orders.length > 0
                ? `${orders.length} orden${orders.length > 1 ? 'es' : ''} esperando repartidor`
                : 'Sin órdenes por ahora'}
            </p>
          </div>
          <Button
            size="sm"
            variant="bordered"
            radius="full"
            onPress={() => { fetchPending(); fetchActiveOrder() }}
            isDisabled={loading}
            startContent={<span className="text-sm">🔄</span>}
          >
            Actualizar
          </Button>
        </div>

        {/* Banner pedido en curso */}
        {activeOrder && (
          <div className="flex items-center gap-3 bg-warning-50 dark:bg-warning/10 border border-warning-200 dark:border-warning/30 rounded-2xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-warning/20 flex items-center justify-center shrink-0 text-lg">
              ⚠️
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-warning-700 dark:text-warning text-sm">
                Ya tienes un pedido en curso
              </p>
              <p className="text-xs text-warning-600/70 dark:text-warning/60 truncate">
                Orden #{activeOrder.orderId} · {activeOrder.status}
              </p>
            </div>
            <Chip size="sm" color="warning" variant="flat" radius="full">
              En ruta
            </Chip>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Spinner size="lg" color="primary" />
            <p className="text-default-400 text-sm">Buscando órdenes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-default-100 flex items-center justify-center text-4xl">
              🛵
            </div>
            <div className="text-center">
              <p className="font-semibold text-default-600">Sin órdenes pendientes</p>
              <p className="text-sm text-default-400 mt-1">
                Las nuevas órdenes aparecerán aquí automáticamente
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card
                key={order.id}
                shadow="sm"
                radius="lg"
                className="border border-default-100 bg-content1 hover:shadow-md transition-shadow"
              >
                <CardBody className="p-0 overflow-hidden">
                  {/* Franja superior de color */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary to-primary-400 rounded-t-xl" />

                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                          📦
                        </div>
                        <div>
                          <p className="font-bold text-sm">Orden #{order.orderId}</p>
                          <Chip size="sm" color="warning" variant="dot" radius="sm" className="h-5 text-[11px]">
                            Pendiente
                          </Chip>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-default-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </p>
                        <p className="text-[10px] text-default-300">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                              })
                            : ''}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-default-100" />

                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-default-100 flex items-center justify-center text-sm shrink-0">
                          👤
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{order.customerName}</p>
                          {order.customerPhone && (
                            <p className="text-xs text-default-400">{order.customerPhone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-danger/10 flex items-center justify-center text-sm shrink-0 mt-0.5">
                          📍
                        </div>
                        <p className="text-sm text-default-600 leading-snug">{order.destinationAddress}</p>
                      </div>
                      {order.customerNotes && (
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-default-100 flex items-center justify-center text-sm shrink-0 mt-0.5">
                            📝
                          </div>
                          <p className="text-xs text-default-400 italic leading-snug">{order.customerNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Botón */}
                    {activeOrder ? (
                      <div className="flex items-center justify-center gap-2 w-full rounded-xl bg-warning-50 dark:bg-warning/10 border border-warning-200 dark:border-warning/20 px-4 py-2.5">
                        <span className="text-sm">🚫</span>
                        <p className="text-sm font-medium text-warning-700 dark:text-warning">
                          Tienes un pedido en curso, no puedes aceptarlo
                        </p>
                      </div>
                    ) : (
                      <Button
                        color="primary"
                        fullWidth
                        radius="lg"
                        onPress={() => handleAccept(order.id)}
                        isLoading={accepting === order.id}
                        isDisabled={accepting !== null}
                        className="font-semibold"
                        startContent={accepting !== order.id ? <span>✅</span> : undefined}
                      >
                        {accepting === order.id ? 'Aceptando...' : 'Aceptar esta orden'}
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
