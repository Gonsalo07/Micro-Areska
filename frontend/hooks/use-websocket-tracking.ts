import { useEffect, useRef, useState } from 'react'

import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { config } from '@/lib/config'

export interface DeliveryLocationUpdate {
  deliveryId: number
  orderId: number
  latitude: number
  longitude: number
  timestamp: number
  driverName?: string
  estimatedDistance?: string
  estimatedDuration?: string
}

interface UseWebSocketTrackingOptions {
  orderId: number | undefined
  enabled: boolean
  onLocationUpdate: (update: DeliveryLocationUpdate) => void
}

export const useWebSocketTracking = ({
  orderId,
  enabled,
  onLocationUpdate,
}: UseWebSocketTrackingOptions) => {
  const clientRef = useRef<Client | null>(null)
  const connectingRef = useRef(false) // Prevent double connection in Strict Mode
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const onLocationUpdateRef = useRef(onLocationUpdate)

  // Actualizar la referencia del callback cuando cambie
  useEffect(() => {
    onLocationUpdateRef.current = onLocationUpdate
  }, [onLocationUpdate])

  useEffect(() => {
    if (!orderId || !enabled) {
      // Desconectar si el tracking se deshabilita
      if (clientRef.current?.active) {
        console.log('🔌 Desconectando WebSocket (disabled o sin orderId)...')
        clientRef.current.deactivate()
        setIsConnected(false)
      }
      connectingRef.current = false
      return
    }

    // Evitar múltiples conexiones (incluyendo React Strict Mode)
    if (clientRef.current?.active || connectingRef.current) {
      console.log('⚠️ Ya existe una conexión activa o en progreso')
      return
    }

    // Marcar que estamos conectando
    connectingRef.current = true

    // Crear socket a través del Gateway conectado al delivery-service
    const wsUrl = `${config.api.baseUrl}/delivery-ws`
    console.log('🔌 Conectando WebSocket a:', wsUrl)
    const socket = new SockJS(wsUrl)

    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🗺️ STOMP Tracking:', str)
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    stompClient.onConnect = () => {
      console.log('✅ WebSocket Tracking conectado para orden:', orderId)
      setIsConnected(true)
      setError(null)
      connectingRef.current = false

      // Suscribirse al topic de ubicación de esta orden
      stompClient.subscribe(`/topic/order/${orderId}/location`, (message) => {
        try {
          const locationUpdate: DeliveryLocationUpdate = JSON.parse(message.body)
          console.log('📍 Ubicación recibida por WebSocket:', locationUpdate)
          onLocationUpdateRef.current(locationUpdate)
        } catch (err) {
          console.error('Error parsing location update:', err)
        }
      })
    }

    stompClient.onStompError = (frame) => {
      console.error('❌ Error STOMP Tracking:', frame.headers['message'])
      console.error('Detalles:', frame.body)
      setError(new Error(frame.headers['message']))
      setIsConnected(false)
      connectingRef.current = false
    }

    stompClient.onWebSocketClose = () => {
      console.log('🔌 WebSocket Tracking cerrado')
      setIsConnected(false)
      connectingRef.current = false
    }

    stompClient.activate()
    clientRef.current = stompClient

    // Cleanup al desmontar o cambiar orderId/enabled
    return () => {
      connectingRef.current = false
      if (clientRef.current?.active) {
        console.log('🔌 Desconectando WebSocket Tracking (cleanup)...')
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [orderId, enabled])

  return {
    isConnected,
    error,
  }
}
