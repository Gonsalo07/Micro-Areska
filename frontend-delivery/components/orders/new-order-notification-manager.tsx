'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { Check, Lock, MapPin, Package, StickyNote, User } from 'lucide-react'
import { PrimaryButton } from '@/components/primary-button'
import { useAuthStore } from '@/features/auth/stores/auth.store'
import { orderDeliveriesApi } from '@/features/delivery/api/order-deliveries'
import type { NewOrderNotification } from '@/hooks/use-new-order-notification'
import { useNewOrderNotification } from '@/hooks/use-new-order-notification'

const ACCEPT_TIMEOUT_SECONDS = 30

interface PendingOrderItem {
  order: NewOrderNotification
  taken: boolean
}

export const NewOrderNotificationManager = () => {
  const { driver } = useAuthStore()
  const [pendingOrders, setPendingOrders] = useState<PendingOrderItem[]>([])

  const handleNewOrder = useCallback((order: NewOrderNotification) => {
    setPendingOrders((prev) => {
      // evitar duplicados
      if (prev.some((p) => p.order.deliveryId === order.deliveryId)) return prev
      return [...prev, { order, taken: false }]
    })
  }, [])

  const handleOrderTaken = useCallback((deliveryId: number) => {
    setPendingOrders((prev) =>
      prev.map((p) =>
        p.order.deliveryId === deliveryId ? { ...p, taken: true } : p
      )
    )
    // Auto-dismiss después de 3s
    setTimeout(() => {
      setPendingOrders((prev) => prev.filter((p) => p.order.deliveryId !== deliveryId))
    }, 3000)
  }, [])

  const dismiss = useCallback((deliveryId: number) => {
    setPendingOrders((prev) => prev.filter((p) => p.order.deliveryId !== deliveryId))
  }, [])

  const handleAccept = useCallback(
    async (deliveryId: number) => {
      if (!driver?.id) return
      const result = await orderDeliveriesApi.acceptOrder(deliveryId, driver.id)
      if (result === null) {
        // Ya fue tomada por otro
        setPendingOrders((prev) =>
          prev.map((p) =>
            p.order.deliveryId === deliveryId ? { ...p, taken: true } : p
          )
        )
        setTimeout(() => dismiss(deliveryId), 2500)
      } else {
        dismiss(deliveryId)
        // Recargar la página para mostrar la orden activa
        window.location.href = '/en-ruta'
      }
    },
    [driver?.id, dismiss]
  )

  const { isConnected } = useNewOrderNotification({
    enabled: !!driver,
    onNewOrder: handleNewOrder,
    onOrderTaken: handleOrderTaken,
  })

  if (pendingOrders.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-6 gap-3 pointer-events-none px-4">
      {pendingOrders.map(({ order, taken }) => (
        <NewOrderCard
          key={order.deliveryId}
          order={order}
          taken={taken}
          onAccept={() => handleAccept(order.deliveryId)}
          onDismiss={() => dismiss(order.deliveryId)}
        />
      ))}
    </div>
  )
}

interface NewOrderCardProps {
  order: NewOrderNotification
  taken: boolean
  onAccept: () => void
  onDismiss: () => void
}

const NewOrderCard = ({ order, taken, onAccept, onDismiss }: NewOrderCardProps) => {
  const [timeLeft, setTimeLeft] = useState(ACCEPT_TIMEOUT_SECONDS)
  const [accepting, setAccepting] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (taken) return
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!)
          onDismiss()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [taken, onDismiss])

  const handleAccept = async () => {
    setAccepting(true)
    await onAccept()
    setAccepting(false)
  }

  const progress = (timeLeft / ACCEPT_TIMEOUT_SECONDS) * 100

  return (
    <Card
      className="w-full max-w-sm pointer-events-auto shadow-2xl border-2 border-primary"
      classNames={{ base: `${taken ? 'border-default-300' : 'border-primary'}` }}
    >
      <CardBody className="p-4 gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {taken ? <Lock className="size-4" /> : <Package className="size-4" />}
            </div>
            <div>
              <p className="font-bold text-sm text-primary">
                {taken ? 'Orden tomada' : '¡Nueva orden!'}
              </p>
              <p className="text-xs text-default-500">Orden #{order.orderId}</p>
            </div>
          </div>
          {!taken && (
            <div className="flex flex-col items-center">
              <span
                className={`text-xl font-bold tabular-nums ${timeLeft <= 10 ? 'text-danger' : 'text-warning'}`}
              >
                {timeLeft}s
              </span>
              {/* Barra de progreso */}
              <div className="w-12 h-1 bg-default-200 rounded-full mt-1">
                <div
                  className={`h-1 rounded-full transition-all ${timeLeft <= 10 ? 'bg-danger' : 'bg-warning'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="space-y-1 text-sm">
          <div className="flex items-start gap-2">
            <User className="mt-0.5 size-4 shrink-0 text-default-500" />
            <span className="font-medium">{order.customerName}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-default-500" />
            <span className="text-default-700 text-xs leading-tight">
              {order.destinationAddress}
            </span>
          </div>
          {order.customerNotes && (
            <div className="flex items-start gap-2">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-default-500" />
              <span className="text-default-500 text-xs italic">{order.customerNotes}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        {taken ? (
          <p className="text-center text-xs text-default-400 py-1">
            Fue aceptada por otro repartidor
          </p>
        ) : (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="flat"
              color="default"
              className="flex-1"
              onPress={onDismiss}
              isDisabled={accepting}
            >
              Ignorar
            </Button>
            <PrimaryButton
              className="flex-1"
              onPress={handleAccept}
              isLoading={accepting}
              startContent={!accepting ? <Check className="size-4" /> : undefined}
            >
              Aceptar
            </PrimaryButton>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
