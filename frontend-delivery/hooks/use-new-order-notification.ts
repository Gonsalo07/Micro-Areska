'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { config } from '@/lib/config'

export interface NewOrderNotification {
  deliveryId: number
  orderId: number
  customerName: string
  customerPhone: string
  destinationAddress: string
  destinationLat: number | null
  destinationLng: number | null
  customerNotes: string | null
  createdAt: string
}

interface UseNewOrderNotificationOptions {
  enabled: boolean
  onNewOrder: (order: NewOrderNotification) => void
  onOrderTaken: (deliveryId: number) => void
}

export const useNewOrderNotification = ({
  enabled,
  onNewOrder,
  onOrderTaken,
}: UseNewOrderNotificationOptions) => {
  const clientRef = useRef<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const takenSubscriptions = useRef<Map<number, () => void>>(new Map())

  const subscribeToOrderTaken = useCallback(
    (deliveryId: number) => {
      if (!clientRef.current?.active) return
      if (takenSubscriptions.current.has(deliveryId)) return

      const sub = clientRef.current.subscribe(
        `/topic/orders/taken/${deliveryId}`,
        () => {
          onOrderTaken(deliveryId)
        }
      )
      takenSubscriptions.current.set(deliveryId, () => sub.unsubscribe())
    },
    [onOrderTaken]
  )

  useEffect(() => {
    if (!enabled) {
      if (clientRef.current?.active) {
        clientRef.current.deactivate()
        setIsConnected(false)
      }
      return
    }

    if (clientRef.current?.active) return

    const wsUrl = `${config.api.baseUrl}/delivery-ws`
    const socket = new SockJS(wsUrl)

    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 8000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    stompClient.onConnect = () => {
      setIsConnected(true)

      // Suscribirse a las nuevas órdenes pendientes
      stompClient.subscribe('/topic/orders/available', (message) => {
        try {
          const order: NewOrderNotification = JSON.parse(message.body)
          onNewOrder(order)
          // Inmediatamente suscribirse al evento "tomada" de esta orden
          subscribeToOrderTaken(order.deliveryId)
        } catch (err) {
          console.error('Error parsing new order notification:', err)
        }
      })
    }

    stompClient.onStompError = () => setIsConnected(false)
    stompClient.onWebSocketClose = () => setIsConnected(false)

    stompClient.activate()
    clientRef.current = stompClient

    return () => {
      takenSubscriptions.current.forEach((unsub) => unsub())
      takenSubscriptions.current.clear()
      if (clientRef.current?.active) {
        clientRef.current.deactivate()
      }
    }
  }, [enabled, onNewOrder, subscribeToOrderTaken])

  return { isConnected }
}
