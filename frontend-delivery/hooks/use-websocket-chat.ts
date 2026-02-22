import { useEffect, useRef, useCallback, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export interface WebSocketMessage {
  id: number
  orderId: number
  senderType: 'CLIENTE' | 'ADMIN' | 'DELIVERY_DRIVER'
  senderId: number
  message: string
  messageType: 'TEXT' | 'IMAGE' | 'LOCATION'
  sentAt: string
  readAt?: string
}

interface UseWebSocketChatOptions {
  orderId: number | undefined
  enabled: boolean
  onMessage: (message: WebSocketMessage) => void
}

export const useWebSocketChat = ({ orderId, enabled, onMessage }: UseWebSocketChatOptions) => {
  const clientRef = useRef<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connect = useCallback(() => {
    if (!orderId || !enabled) {
      return
    }

    // Crear socket a través del Gateway
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`)
    
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('🔌 STOMP:', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    stompClient.onConnect = () => {
      console.log('✅ WebSocket conectado para orden:', orderId)
      setIsConnected(true)
      setError(null)

      // Suscribirse al topic del chat de esta orden
      stompClient.subscribe(`/topic/chat/${orderId}`, (message) => {
        try {
          const parsedMessage: WebSocketMessage = JSON.parse(message.body)
          console.log('📨 Mensaje recibido por WebSocket:', parsedMessage)
          onMessage(parsedMessage)
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      })
    }

    stompClient.onStompError = (frame) => {
      console.error('❌ Error STOMP:', frame.headers['message'])
      console.error('Detalles:', frame.body)
      setError(new Error(frame.headers['message']))
      setIsConnected(false)
    }

    stompClient.onWebSocketClose = () => {
      console.log('🔌 WebSocket cerrado')
      setIsConnected(false)
    }

    stompClient.activate()
    clientRef.current = stompClient

    return () => {
      if (clientRef.current?.active) {
        console.log('🔌 Desconectando WebSocket...')
        clientRef.current.deactivate()
      }
    }
  }, [orderId, enabled, onMessage])

  useEffect(() => {
    if (enabled && orderId) {
      const cleanup = connect()
      return cleanup
    } else {
      // Desconectar si el chat se deshabilita
      if (clientRef.current?.active) {
        clientRef.current.deactivate()
        setIsConnected(false)
      }
    }
  }, [enabled, orderId, connect])

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate()
      setIsConnected(false)
    }
  }, [])

  return {
    isConnected,
    error,
    disconnect,
  }
}
