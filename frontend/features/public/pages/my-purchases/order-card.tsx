import {
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
  Store,
  Truck,
  User,
} from 'lucide-react'
import Link from 'next/link'

import { type OrderDeliveryDetail } from '@public/api/delivery'
import { type OrderResponse } from '@public/api/orders'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  getDeliveryStatusColor,
  getDeliveryStatusLabel,
  getOrderStatusColor,
  getOrderStatusLabel,
} from '@/lib/constants/order-status'
import { cn } from '@/lib/utils'

type OrderWithDelivery = OrderResponse & {
  deliveryDetail?: OrderDeliveryDetail | null
}

type OrderCardProps = {
  order: OrderWithDelivery
}

function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <Badge variant="outline" className={cn('rounded-full border-transparent', className)}>
      {label}
    </Badge>
  )
}

export function OrderCard({ order }: OrderCardProps) {
  const { deliveryDetail } = order
  const showLiveTracking =
    deliveryDetail &&
    ['OUT_FOR_DELIVERY', 'ARRIVED'].includes(deliveryDetail.status)

  return (
    <Card className="gap-0 py-0 shadow-sm">
      <CardHeader className="border-b px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Package className="size-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
              <CardDescription>{order.orderDate}</CardDescription>
            </div>
          </div>
          <StatusBadge
            label={getOrderStatusLabel(order.status)}
            className={getOrderStatusColor(order.status)}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 py-5">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            {order.pickupMethod === 'delivery' ? (
              <Truck className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Store className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-muted-foreground">Método:</span>
            <span className="font-medium">
              {order.pickupMethod === 'delivery' ? 'Envío a domicilio' : 'Recoger en tienda'}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-muted-foreground">Total:</span>
            <span className="text-lg font-semibold">S/ {order.total.toFixed(2)}</span>
          </div>
        </div>

        {order.pickupMethod === 'delivery' && deliveryDetail && (
          <>
            <Separator />
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Estado de entrega</span>
                </div>
                <StatusBadge
                  label={getDeliveryStatusLabel(deliveryDetail.status)}
                  className={getDeliveryStatusColor(deliveryDetail.status)}
                />
              </div>

              {deliveryDetail.driverName && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border bg-card p-3">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{deliveryDetail.driverName}</p>
                    {deliveryDetail.driverPhone && (
                      <p className="text-xs text-muted-foreground">{deliveryDetail.driverPhone}</p>
                    )}
                  </div>
                </div>
              )}

              <p className="mb-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Dirección: </span>
                {deliveryDetail.destinationAddress}
                {deliveryDetail.destinationReference && (
                  <span> ({deliveryDetail.destinationReference})</span>
                )}
              </p>

              <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {deliveryDetail.assignedAt && (
                  <p>
                    <span className="font-medium text-foreground">Asignado:</span>{' '}
                    {deliveryDetail.assignedAt}
                  </p>
                )}
                {deliveryDetail.acceptedAt && (
                  <p>
                    <span className="font-medium text-foreground">Aceptado:</span>{' '}
                    {deliveryDetail.acceptedAt}
                  </p>
                )}
                {deliveryDetail.pickedUpAt && (
                  <p>
                    <span className="font-medium text-foreground">Recogido:</span>{' '}
                    {deliveryDetail.pickedUpAt}
                  </p>
                )}
                {deliveryDetail.outForDeliveryAt && (
                  <p>
                    <span className="font-medium text-foreground">En camino:</span>{' '}
                    {deliveryDetail.outForDeliveryAt}
                  </p>
                )}
                {deliveryDetail.arrivedAt && (
                  <p>
                    <span className="font-medium text-foreground">Llegó:</span>{' '}
                    {deliveryDetail.arrivedAt}
                  </p>
                )}
                {deliveryDetail.deliveredAt && (
                  <p className="font-medium text-green-600 dark:text-green-400 sm:col-span-2">
                    Entregado: {deliveryDetail.deliveredAt}
                  </p>
                )}
                {deliveryDetail.cancelledAt && (
                  <p className="font-medium text-destructive sm:col-span-2">
                    Cancelado: {deliveryDetail.cancelledAt}
                    {deliveryDetail.cancellationReason && (
                      <span className="font-normal"> — {deliveryDetail.cancellationReason}</span>
                    )}
                  </p>
                )}
              </div>

              {showLiveTracking && (
                <Button asChild className="mt-4 w-full">
                  <Link href={`/mis-compras/seguimiento/${order.id}`}>
                    <MapPin />
                    <MessageCircle />
                    Ver seguimiento en vivo
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}

        <Separator />

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag className="size-4 text-muted-foreground" />
            Productos
          </h3>
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
        </div>
      </CardContent>
    </Card>
  )
}
