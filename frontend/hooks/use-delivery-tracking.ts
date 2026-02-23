import { useEffect, useRef, useState } from 'react'

import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { config } from '@/lib/config'

/** Payload del delivery service (/api/delivery-ws) */
export interface DeliveryStatusUpdate {
  deliveryId: number
  orderId: number
  status: string
  statusLabel: string
  message: string
  driverName: string | null
  driverPhone: string | null
  driverPhotoUrl: string | null
  driverLat: number | null
  driverLng: number | null
  changedAt: string
}

/** Payload del order service (/api/ws) */
export interface OrderStatusUpdate {
  orderId: number
  status: string
  statusLabel: string
  message: string
  changedAt: string
}

interface UseOrderTrackingOptions {
  orderId: number | undefined
  enabled: boolean
  onDeliveryUpdate?: (update: DeliveryStatusUpdate) => void
  onOrderUpdate?: (update: OrderStatusUpdate) => void
}

function createStompClient(wsUrl: string): Client {
  return new Client({
    webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: () => {},
  })
}

export const useOrderTracking = ({
  orderId,
  enabled,
  onDeliveryUpdate,
  onOrderUpdate,
}: UseOrderTrackingOptions) => {
  const deliveryClientRef = useRef<Client | null>(null)
  const orderClientRef = useRef<Client | null>(null)
  const [deliveryWsConnected, setDeliveryWsConnected] = useState(false)
  const [orderWsConnected, setOrderWsConnected] = useState(false)

  // Refs para callbacks — evita re-suscripciones innecesarias
  const onDeliveryUpdateRef = useRef(onDeliveryUpdate)
  const onOrderUpdateRef = useRef(onOrderUpdate)
  useEffect(() => {
    onDeliveryUpdateRef.current = onDeliveryUpdate
  })
  useEffect(() => {
    onOrderUpdateRef.current = onOrderUpdate
  })

  useEffect(() => {
    if (!orderId || !enabled) {
      deliveryClientRef.current?.deactivate()
      orderClientRef.current?.deactivate()
      setDeliveryWsConnected(false)
      setOrderWsConnected(false)
      return
    }

    // ── Conexión 1: delivery-ws → estados de la entrega ──────────────────
    const deliveryClient = createStompClient(`${config.api.baseUrl}/delivery-ws`)

    deliveryClient.onConnect = () => {
      console.log('✅ [Tracking/delivery-ws] conectado, orden:', orderId)
      setDeliveryWsConnected(true)
      deliveryClient.subscribe(`/topic/order/${orderId}/tracking`, (msg) => {
        try {
          onDeliveryUpdateRef.current?.(JSON.parse(msg.body) as DeliveryStatusUpdate)
        } catch (e) {
          console.error('[Tracking/delivery-ws] parse error', e)
        }
      })
    }
    deliveryClient.onWebSocketClose = () => setDeliveryWsConnected(false)
    deliveryClient.onStompError = () => setDeliveryWsConnected(false)
    deliveryClient.activate()
    deliveryClientRef.current = deliveryClient

    // ── Conexión 2: ws → estados de la orden ─────────────────────────────
    const orderClient = createStompClient(`${config.api.baseUrl}/ws`)

    orderClient.onConnect = () => {
      console.log('✅ [Tracking/order-ws] conectado, orden:', orderId)
      setOrderWsConnected(true)
      orderClient.subscribe(`/topic/order/${orderId}/status`, (msg) => {
        try {
          onOrderUpdateRef.current?.(JSON.parse(msg.body) as OrderStatusUpdate)
        } catch (e) {
          console.error('[Tracking/order-ws] parse error', e)
        }
      })
    }
    orderClient.onWebSocketClose = () => setOrderWsConnected(false)
    orderClient.onStompError = () => setOrderWsConnected(false)
    orderClient.activate()
    orderClientRef.current = orderClient

    return () => {
      deliveryClient.deactivate()
      orderClient.deactivate()
      setDeliveryWsConnected(false)
      setOrderWsConnected(false)
    }
  }, [orderId, enabled])

  return { deliveryWsConnected, orderWsConnected }
}

// Alias para compatibilidad con código existente
export const useDeliveryTracking = useOrderTracking
