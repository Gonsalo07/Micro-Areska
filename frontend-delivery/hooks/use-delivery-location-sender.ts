import { useRef, useCallback, useState, useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { config } from '@/lib/config'

export interface DeliveryLocationUpdate {
  deliveryId: number
  orderId: number
  latitude: number
  longitude: number
  timestamp?: number
  estimatedDistance?: string
  estimatedDuration?: string
}

interface UseDeliveryLocationSenderOptions {
  deliveryId: number | undefined
  orderId: number | undefined
  enabled: boolean
}

export const useDeliveryLocationSender = ({
  deliveryId,
  orderId,
  enabled,
}: UseDeliveryLocationSenderOptions) => {
  // DEBUG: Verificar que el hook se ejecuta
  console.log('🪝 useDeliveryLocationSender HOOK CALLED:', { deliveryId, orderId, enabled });
  
  const clientRef = useRef<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const connectingRef = useRef(false) // Prevent double connection in Strict Mode

  const sendLocation = useCallback(
    (latitude: number, longitude: number, estimatedDistance?: string, estimatedDuration?: string) => {
      if (!clientRef.current?.active || !deliveryId || !orderId) {
        console.warn('⚠️ WebSocket no conectado o faltan IDs')
        return false
      }

      try {
        const locationUpdate: DeliveryLocationUpdate = {
          deliveryId,
          orderId,
          latitude,
          longitude,
          timestamp: Date.now(),
          estimatedDistance,
          estimatedDuration,
        }

        clientRef.current.publish({
          destination: '/app/delivery/location',
          body: JSON.stringify(locationUpdate),
        })

        console.log('📍 Ubicación enviada:', locationUpdate)
        return true
      } catch (err) {
        console.error('❌ Error enviando ubicación:', err)
        setError(err as Error)
        return false
      }
    },
    [deliveryId, orderId]
  )

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      console.log('🔌 Desconectando WebSocket Delivery...')
      clientRef.current.deactivate()
      setIsConnected(false)
    }
  }, [])

  // Auto-conectar cuando esté habilitado (como el hook de chat)
  useEffect(() => {
    // FORZAR REBUILD - borrar después
    console.log('🚀🚀🚀 USE EFFECT EJECUTANDO - V2 🚀🚀🚀');
    console.log('🔍 Hook delivery location - Estado:', {
      deliveryId,
      orderId,
      enabled,
      isCurrentlyConnected: clientRef.current?.active,
      isConnecting: connectingRef.current
    });

    if (!enabled || !deliveryId || !orderId) {
      // Desconectar si se deshabilita
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
        setIsConnected(false);
      }
      connectingRef.current = false;
      return;
    }

    // Prevenir múltiples conexiones (incluyendo React Strict Mode)
    if (clientRef.current?.active || connectingRef.current) {
      console.log('⚠️ Ya existe una conexión activa o en progreso');
      return;
    }

    // Marcar que estamos conectando
    connectingRef.current = true;

    // Crear socket a través del Gateway conectado al delivery-service
    const wsUrl = `${config.api.baseUrl}/delivery-ws`
    console.log('🌐 CONFIG API BASE URL:', config.api.baseUrl);
    console.log('🔌 URL COMPLETA WebSocket:', wsUrl);
    console.log('🚀 CREANDO SockJS con URL:', wsUrl);
    
    const socket = new SockJS(wsUrl)
    console.log('✅ SockJS creado, activando STOMP...');

    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚗 STOMP Delivery:', str)
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    stompClient.onConnect = () => {
      console.log('✅ WebSocket Delivery conectado - Delivery ID:', deliveryId)
      setIsConnected(true)
      setError(null)
      connectingRef.current = false;
    }

    stompClient.onStompError = (frame) => {
      console.error('❌ Error STOMP Delivery:', frame.headers['message'])
      console.error('Detalles:', frame.body)
      setError(new Error(frame.headers['message']))
      setIsConnected(false)
      connectingRef.current = false;
    }

    stompClient.onWebSocketClose = () => {
      console.log('🔌 WebSocket Delivery cerrado')
      setIsConnected(false)
      connectingRef.current = false;
    }

    stompClient.activate()
    clientRef.current = stompClient

    // Cleanup solo al desmontar el componente
    return () => {
      connectingRef.current = false;
      if (clientRef.current?.active) {
        console.log('🔌 Desactivando WebSocket Delivery (cleanup)')
        clientRef.current.deactivate()
      }
    }
  }, [enabled, deliveryId, orderId]);

  return {
    disconnect,
    sendLocation,
    isConnected,
    error,
  }
}
