'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  ArrowLeft,
  Check,
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAuthStore } from '@auth/stores/auth.store'
import { deliveryApi, type OrderDeliveryDetail } from '@public/api/delivery'
import { type OrderResponse, ordersApi } from '@public/api/orders'

import { CustomerChat } from '@/components/tracking/customer-chat'
import { DeliveryMap } from '@/components/tracking/delivery-map'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  type DeliveryStatusUpdate,
  type OrderStatusUpdate,
  useOrderTracking,
} from '@/hooks/use-delivery-tracking'
import { getDeliveryStatusColor, getDeliveryStatusLabel } from '@/lib/constants/order-status'
import { cn } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notification-store'

const ACTIVE_STATUSES = ['ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'ARRIVED']
const CHAT_ENABLED_STATUSES = ['OUT_FOR_DELIVERY', 'ARRIVED']

const PROGRESS_STEPS = [
  { key: 'ASSIGNED', label: 'Asignado' },
  { key: 'ACCEPTED', label: 'Aceptado' },
  { key: 'PICKED_UP', label: 'Recogido' },
  { key: 'OUT_FOR_DELIVERY', label: 'En camino' },
  { key: 'DELIVERED', label: 'Entregado' },
] as const

function getProgressPercent(status: string): number {
  switch (status) {
    case 'ASSIGNED':
      return 20
    case 'ACCEPTED':
      return 40
    case 'PICKED_UP':
      return 60
    case 'OUT_FOR_DELIVERY':
      return 80
    case 'ARRIVED':
      return 95
    case 'DELIVERED':
      return 100
    default:
      return 0
  }
}

function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <Badge variant="outline" className={cn('rounded-full border-transparent', className)}>
      {label}
    </Badge>
  )
}

function TrackingState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Package
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function TrackingPage() {
  const params = useParams()
  const router = useRouter()
  const profile = useAuthStore((s) => s.profile)

  const orderId = parseInt(params.orderId as string)

  const addNotification = useNotificationStore((s) => s.add)

  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [delivery, setDelivery] = useState<OrderDeliveryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const showNotif = useCallback(
    (message: string, label: string, type: 'delivery' | 'order') => {
      toast(label, {
        description: message,
        icon: type === 'delivery' ? '🚚' : '📋',
        duration: 6000,
      })
      addNotification({ type, orderId, label, message })
    },
    [addNotification, orderId]
  )

  const isChatEnabled = delivery ? CHAT_ENABLED_STATUSES.includes(delivery.status) : false
  const isTrackingActive = delivery ? ACTIVE_STATUSES.includes(delivery.status) : false

  useOrderTracking({
    orderId: isTrackingActive ? orderId : undefined,
    enabled: isTrackingActive,
    onDeliveryUpdate: useCallback(
      (update: DeliveryStatusUpdate) => {
        setDelivery((prev) =>
          prev
            ? {
                ...prev,
                status: update.status as import('@/lib/constants/order-status').DeliveryStatus,
              }
            : prev
        )
        showNotif(update.message, update.statusLabel, 'delivery')
        if (update.status === 'DELIVERED' || update.status === 'CANCELLED') {
          setTimeout(() => router.push('/mis-compras'), 4000)
        }
      },
      [router, showNotif]
    ),
    onOrderUpdate: useCallback(
      (update: OrderStatusUpdate) => {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status: update.status as import('@/lib/constants/order-status').OrderStatus,
              }
            : prev
        )
        showNotif(update.message, update.statusLabel, 'order')
        if (update.status === 'completed' || update.status === 'cancelled') {
          setTimeout(() => router.push('/mis-compras'), 4000)
        }
      },
      [router, showNotif]
    ),
  })

  const fetchOrderAndDelivery = useCallback(async () => {
    if (!orderId || !profile?.firebaseUid) return

    try {
      const orderData = await ordersApi.getById(orderId)
      setOrder(orderData)

      if (orderData.pickupMethod === 'delivery') {
        const deliveryData = await deliveryApi.getByOrderId(orderId)
        setDelivery(deliveryData)

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
    const interval = setInterval(fetchOrderAndDelivery, 15000)
    return () => clearInterval(interval)
  }, [fetchOrderAndDelivery])

  const backButton = (
    <Button variant="outline" asChild>
      <Link href="/mis-compras">
        <ArrowLeft />
        Volver a mis compras
      </Link>
    </Button>
  )

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-5" />
        <span>Cargando seguimiento...</span>
      </div>
    )
  }

  if (error || !order) {
    return (
      <TrackingState
        icon={Package}
        title="Pedido no encontrado"
        description={error || 'No pudimos cargar este pedido.'}
        action={backButton}
      />
    )
  }

  if (!delivery) {
    return (
      <TrackingState
        icon={Truck}
        title="Sin información de entrega"
        description="Este pedido no tiene datos de envío disponibles."
        action={backButton}
      />
    )
  }

  const progress = getProgressPercent(delivery.status)
  const currentStepIndex = PROGRESS_STEPS.findIndex((step) => step.key === delivery.status)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" asChild className="-ml-2 mb-6">
        <Link href="/mis-compras">
          <ArrowLeft />
          Mis compras
        </Link>
      </Button>

      <Card className="mb-6 gap-0 py-0 shadow-sm">
        <CardHeader className="border-b px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Package className="size-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Seguimiento · Pedido #{order.id}</CardTitle>
                <CardDescription>{order.orderDate}</CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <StatusBadge
                label={getDeliveryStatusLabel(delivery.status)}
                className={getDeliveryStatusColor(delivery.status)}
              />
              <p className="text-lg font-semibold">S/ {order.total.toFixed(2)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-5">
          <div className="mb-3 hidden justify-between text-xs text-muted-foreground sm:flex">
            {PROGRESS_STEPS.map((step) => (
              <span key={step.key}>{step.label}</span>
            ))}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {PROGRESS_STEPS.map((step, index) => {
              const isDone = currentStepIndex > index || delivery.status === 'DELIVERED'
              const isCurrent = step.key === delivery.status
              return (
                <Badge
                  key={step.key}
                  variant={isCurrent ? 'default' : isDone ? 'secondary' : 'outline'}
                  className="gap-1"
                >
                  {isDone && !isCurrent ? <Check className="size-3" /> : null}
                  {step.label}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <Card className="gap-0 overflow-hidden py-0 shadow-sm lg:col-span-2">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-muted-foreground" />
              Ubicación en tiempo real
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DeliveryMap delivery={delivery} />
          </CardContent>
        </Card>

        <Card className="flex h-full min-h-0 flex-col gap-0 overflow-hidden py-0 shadow-sm">
          <CardHeader className="shrink-0 border-b px-6 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="size-4 text-muted-foreground" />
              Chat con repartidor
            </CardTitle>
            <CardDescription>
              {isChatEnabled
                ? 'Conversación activa mientras el pedido está en camino.'
                : 'Se habilitará cuando el repartidor inicie el viaje.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <CustomerChat orderId={orderId} isEnabled={isChatEnabled} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 gap-0 py-0 shadow-sm">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4 text-muted-foreground" />
            Productos en este pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="divide-y divide-border rounded-lg border">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-muted-foreground">Cantidad: {item.quantity}</p>
                </div>
                <span className="shrink-0 font-semibold">S/ {item.priceTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
