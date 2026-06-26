'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, Card, CardBody, Chip, Spinner } from '@nextui-org/react'
import {
  Ban,
  MapPin,
  Moon,
  Package,
  RefreshCw,
  User,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { orderDeliveriesApi } from '@/features/delivery/api/order-deliveries'
import { PrimaryButton } from '@/components/primary-button'
import { ButtonStartIcon } from '@/components/button-start-icon'
import type { OrderDeliveryDetailResponse } from '@/lib/types/order'
import { toast } from 'sonner'

const iconClass = 'shrink-0 text-default-400'
const STICKY_NOTE_IMG =
  '/vecteezy_a-light-green-paper-note-attached-to-a-map-pin-suitable-for_11288616.png'

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
    }
  }, [])

  const fetchActiveOrder = useCallback(async () => {
    if (!driver?.id) {
      setActiveOrder(null)
      return
    }
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

  const loadPageData = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([fetchPending(), fetchActiveOrder()])
    } finally {
      setLoading(false)
    }
  }, [fetchPending, fetchActiveOrder])

  useEffect(() => {
    if (authLoading) return
    loadPageData()
    const interval = setInterval(() => {
      fetchPending()
      fetchActiveOrder()
    }, 15_000)
    return () => clearInterval(interval)
  }, [loadPageData, fetchPending, fetchActiveOrder, authLoading])

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
    <div className="min-h-full px-4 py-8">
      <div className="max-w-6xl mx-auto w-full space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white shrink-0">
              Órdenes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium sm:mt-0 mt-1 truncate">
              {orders.length > 0
                ? `${orders.length} ${orders.length === 1 ? 'orden disponible' : 'órdenes disponibles'}`
                : 'No hay órdenes pendientes'}
            </p>
          </div>
          <Button
            size="md"
            color="primary"
            variant="light"
            radius="full"
            onPress={() => { loadPageData() }}
            isDisabled={loading}
            className="h-10 min-h-10 shrink-0 px-5 font-medium bg-transparent"
            startContent={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
          >
            Actualizar
          </Button>
        </div>

        {/* Banner pedido en curso */}
        {activeOrder && (
          <Card className="relative overflow-hidden border-l-4 border-l-primary bg-content1 shadow-medium transition-all hover:shadow-lg">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute right-1/3 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl" />
            </div>
            <CardBody className="relative z-10 flex min-h-[88px] flex-row items-center gap-5 p-0 px-6 py-5">
              <Package size={28} className="shrink-0 text-primary" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  Pedido en curso
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-mono font-semibold text-foreground">
                    #{activeOrder.orderId}
                  </span>
                  <span>•</span>
                  <span className="truncate max-w-[150px]">{activeOrder.status}</span>
                </div>
              </div>
              <PrimaryButton
                as="a"
                href="/en-ruta"
                className="shrink-0 px-6"
                startContent={<ButtonStartIcon icon={MapPin} size={16} />}
              >
                Ver mapa
              </PrimaryButton>
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
            <div className="w-24 h-24 rounded-3xl bg-default-100 flex items-center justify-center shadow-inner">
              <Moon size={40} className="text-default-300" strokeWidth={1.5} />
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
              onPress={() => { loadPageData() }}
              className="font-medium"
            >
              Comprobar de nuevo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch animate-in slide-in-from-bottom-4 duration-500">
            {orders.map((order) => (
              <Card
                key={order.id}
                shadow="sm"
                radius="lg"
                className="flex h-full flex-col border border-divider bg-content1 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-visible"
              >
                <CardBody className="flex flex-1 flex-col p-0">
                  {/* Status Bar */}
                  <div className="px-5 py-4 border-b border-divider flex justify-between items-center gap-3 bg-default-100/50 rounded-t-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <Package size={26} className="text-primary shrink-0" strokeWidth={1.75} />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white">Orden #{order.orderId}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {order.createdAt ? formatTime(order.createdAt) : 'Reciente'}
                        </p>
                      </div>
                    </div>
                    <Chip
                      size="sm"
                      classNames={{
                        base: "h-5 shrink-0 px-0 bg-transparent",
                        content: "font-semibold text-[10px] tracking-wide text-primary-600 dark:text-primary-400",
                      }}
                    >
                      Disponible
                    </Chip>
                  </div>

                  <div className="flex flex-1 flex-col p-5 space-y-6">
                    {/* Details */}
                    <div className="space-y-4 flex-1">
                      {order.customerNotes ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 group-hover:bg-default-100 p-2 -mx-2 rounded-xl transition-colors">
                          <div className="flex flex-col gap-4 min-w-0">
                            <div className="flex gap-3.5 min-w-0">
                              <User size={22} className={`${iconClass} mt-0.5`} strokeWidth={1.75} />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-0.5">Cliente</p>
                                <p className="text-sm font-semibold text-foreground truncate">{order.customerName}</p>
                                {order.customerPhone && (
                                  <p className="text-xs text-primary font-medium mt-0.5">{order.customerPhone}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-3.5 min-w-0">
                              <MapPin size={22} className={`${iconClass} mt-0.5`} strokeWidth={1.75} />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-0.5">Destino</p>
                                <p className="text-sm font-medium text-foreground leading-relaxed">
                                  {order.destinationAddress}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center sm:justify-end items-start pt-1">
                            <div className="relative w-[165px] rotate-[1deg] drop-shadow-md shrink-0">
                              <Image
                                src={STICKY_NOTE_IMG}
                                alt=""
                                width={420}
                                height={420}
                                className="h-auto w-full select-none pointer-events-none"
                                aria-hidden
                              />
                              <p className="absolute inset-0 flex items-center justify-center px-6 pt-7 pb-4 text-center text-xs font-semibold italic leading-relaxed text-neutral-800">
                                {order.customerNotes}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 group-hover:bg-default-100 p-2 -mx-2 rounded-xl transition-colors">
                          <div className="flex gap-3.5 min-w-0">
                            <User size={22} className={`${iconClass} mt-0.5`} strokeWidth={1.75} />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-0.5">Cliente</p>
                              <p className="text-sm font-semibold text-foreground truncate">{order.customerName}</p>
                              {order.customerPhone && (
                                <p className="text-xs text-primary font-medium mt-0.5">{order.customerPhone}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3.5 min-w-0">
                            <MapPin size={22} className={`${iconClass} mt-0.5`} strokeWidth={1.75} />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-0.5">Destino</p>
                              <p className="text-sm font-medium text-foreground leading-relaxed">
                                {order.destinationAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="pt-2 mt-auto">
                      {activeOrder ? (
                        <div className="w-full bg-default-100 text-default-500 py-3 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2 opacity-75 cursor-not-allowed border border-dashed border-default-300">
                          <Ban size={18} strokeWidth={1.75} />
                          Termina tu pedido actual primero
                        </div>
                      ) : (
                        <PrimaryButton
                          fullWidth
                          className="text-sm"
                          onPress={() => handleAccept(order.id)}
                          isLoading={accepting === order.id}
                          isDisabled={accepting !== null}
                        >
                          {accepting === order.id ? 'Confirmando...' : 'Aceptar Entrega'}
                        </PrimaryButton>
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
