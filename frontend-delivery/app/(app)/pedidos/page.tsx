'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button, Card, CardBody, Chip, Spinner, Badge } from '@nextui-org/react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { orderDeliveriesApi } from '@/features/delivery/api/order-deliveries'
import type { OrderDeliveryDetailResponse } from '@/lib/types/order'
import { toast } from 'sonner'

export default function PedidosPage() {
  const { driver, loading: authLoading } = useAuthStore()
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
    if (authLoading) return
    fetchPending()
    fetchActiveOrder()
    const interval = setInterval(() => {
      fetchPending()
      fetchActiveOrder()
    }, 15_000)
    return () => clearInterval(interval)
  }, [fetchPending, fetchActiveOrder, authLoading])

  const handleAccept = async (deliveryId: number) => {
    if (!driver?.id) return
    if (activeOrder) return
    setAccepting(deliveryId)
    try {
      const result = await orderDeliveriesApi.acceptOrder(deliveryId, driver.id)
      if (result === null) {
        toast.error('No se pudo aceptar la orden', {
          description: 'La orden ya fue tomada por otro repartidor o no está disponible.',
        })
        await fetchPending()
      } else {
        toast.success('¡Orden aceptada!', { description: 'Redirigiendo a tu entrega...' })
        window.location.href = '/en-ruta'
      }
    } catch {
      toast.error('Error al aceptar la orden', { description: 'Intenta de nuevo.' })
    } finally {
      setAccepting(null)
    }
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-zinc-950 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Órdenes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
              {orders.length > 0
                ? `${orders.length} ${orders.length === 1 ? 'orden disponible' : 'órdenes disponibles'}`
                : 'No hay órdenes pendientes'}
            </p>
          </div>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            radius="full"
            onPress={() => { fetchPending(); fetchActiveOrder() }}
            isDisabled={loading}
            className="font-medium px-4 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
            startContent={<span className={`text-lg transition-transform ${loading ? 'animate-spin' : ''}`}>↻</span>}
          >
            Actualizar
          </Button>
        </div>

        {/* Banner pedido en curso */}
        {activeOrder && (
          <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10 shadow-sm transition-all hover:shadow-md">
            <CardBody className="flex flex-row items-center gap-4 py-4 px-5">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <span className="text-xl">🛵</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  Pedido en curso
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-mono bg-white dark:bg-black/20 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    #{activeOrder.orderId}
                  </span>
                  <span>•</span>
                  <span className="truncate max-w-[150px]">{activeOrder.status}</span>
                </div>
              </div>
              <Button 
                size="md" 
                color="warning" 
                variant="shadow" 
                radius="full"
                as="a"
                href="/en-ruta"
                className="font-extrabold text-white shadow-lg shadow-amber-500/40 px-6"
              >
                VER MAPA
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center animate-in fade-in duration-700">
            <Spinner size="lg" color="primary" classNames={{ circle1: "border-b-primary", circle2: "border-b-primary" }} />
            <p className="text-gray-400 text-sm font-medium animate-pulse">Buscando órdenes cercanas...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
              <span className="text-5xl opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">😴</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Todo tranquilo por ahora</h3>
              <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-2 leading-relaxed">
                Relájate un momento. Las nuevas órdenes aparecerán aquí automáticamente.
              </p>
            </div>
            <Button 
              variant="light" 
              color="primary" 
              onPress={() => { fetchPending(); fetchActiveOrder() }}
              className="font-medium"
            >
              Comprobar de nuevo
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 animate-in slide-in-from-bottom-4 duration-500">
            {orders.map((order) => (
              <Card
                key={order.id}
                shadow="sm"
                radius="lg"
                className="border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-visible"
              >
                <CardBody className="p-0">
                  {/* Status Bar */}
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50 rounded-t-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                        <span className="text-xl">📦</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 dark:text-white">Orden #{order.orderId}</p>
                          <Chip 
                            size="sm" 
                            color="success" 
                            variant="flat" 
                            classNames={{ base: "h-5 px-1.5 bg-green-100 dark:bg-green-900/30", content: "font-semibold text-[10px] text-green-700 dark:text-green-400" }}
                          >
                            DISPONIBLE
                          </Chip>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {order.createdAt ? formatTime(order.createdAt) : 'Reciente'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {/* Details */}
                    <div className="space-y-4">
                      {/* Customer */}
                      <div className="flex gap-4 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800/50 p-2 -mx-2 rounded-xl transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-gray-500">
                          <span className="text-sm">👤</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Cliente</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{order.customerName}</p>
                          {order.customerPhone && (
                            <p className="text-xs text-primary font-medium mt-0.5">{order.customerPhone}</p>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex gap-4 p-2 -mx-2">
                        <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0 mt-0.5 text-rose-600">
                          <span className="text-sm">📍</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Destino</p>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
                            {order.destinationAddress}
                          </p>
                          {order.customerNotes && (
                            <div className="mt-3 text-xs bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-500 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30 flex gap-2">
                              <span className="shrink-0 text-amber-600">📝</span>
                              <span className="italic">{order.customerNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      {activeOrder ? (
                        <div className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 py-3 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2 opacity-75 cursor-not-allowed border border-dashed border-gray-300 dark:border-zinc-700">
                          <span>⛔</span> Termina tu pedido actual primero
                        </div>
                      ) : (
                        <Button
                          size="lg"
                          color="primary"
                          className="w-full font-bold shadow-lg shadow-primary/25 data-[hover=true]:scale-[1.02] active:scale-95 transition-all text-sm"
                          onPress={() => handleAccept(order.id)}
                          isLoading={accepting === order.id}
                          isDisabled={accepting !== null}
                        >
                          {accepting === order.id ? 'Confirmando...' : 'Aceptar Entrega'}
                        </Button>
                      )}
                    </div>
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

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  }).format(date)
}
