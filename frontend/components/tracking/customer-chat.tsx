'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Send } from 'lucide-react'

import { useAuthStore } from '@auth/stores/auth.store'
import { chatApi, type ChatMessage } from '@public/api/chat'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CustomerChatProps {
  orderId: number
  isEnabled: boolean
}

interface Message {
  id: string
  text: string
  sender: 'customer' | 'driver'
  timestamp: Date
}

export function CustomerChat({ orderId, isEnabled }: CustomerChatProps) {
  const profile = useAuthStore((s) => s.profile)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Convertir mensajes de la API al formato del componente
  const mapChatMessage = (msg: ChatMessage): Message => ({
    id: msg.id.toString(),
    text: msg.message,
    sender: msg.senderType === 'DELIVERY_DRIVER' ? 'driver' : 'customer',
    timestamp: new Date(msg.sentAt),
  })

  // Cargar mensajes de la orden
  const loadMessages = useCallback(async () => {
    if (!orderId || !isEnabled) return

    try {
      setLoading(true)
      const chatMessages = await chatApi.getByOrderId(orderId)

      // Validar que la respuesta sea un array
      if (!Array.isArray(chatMessages)) {
        console.error('Invalid chat messages response:', chatMessages)
        setMessages([])
        return
      }

      const mappedMessages = chatMessages.map(mapChatMessage)
      setMessages(mappedMessages)

      // Marcar mensajes del driver como leídos
      const unreadMessages = chatMessages.filter(
        (msg) => !msg.readAt && msg.senderType === 'DELIVERY_DRIVER'
      )
      if (unreadMessages.length > 0) {
        await chatApi.markAllAsRead(orderId)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [orderId, isEnabled])

  // Cargar mensajes cuando el chat se habilita
  useEffect(() => {
    if (isEnabled && orderId) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [isEnabled, orderId, loadMessages])

  // Polling para nuevos mensajes cada 5 segundos (igual que delivery)
  useEffect(() => {
    if (!isEnabled || !orderId) return

    const interval = setInterval(async () => {
      try {
        const chatMessages = await chatApi.getByOrderId(orderId)

        // Validar que la respuesta sea un array
        if (!Array.isArray(chatMessages)) {
          return
        }

        const mappedMessages = chatMessages.map(mapChatMessage)

        // Solo actualizar si hay cambios
        if (JSON.stringify(mappedMessages) !== JSON.stringify(messages)) {
          setMessages(mappedMessages)

          // Marcar nuevos mensajes del driver como leídos
          const unreadMessages = chatMessages.filter(
            (msg) => !msg.readAt && msg.senderType === 'DELIVERY_DRIVER'
          )
          if (unreadMessages.length > 0) {
            await chatApi.markAllAsRead(orderId)
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isEnabled, orderId, messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isEnabled || !profile?.id) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      await chatApi.sendMessage({
        orderId,
        senderType: 'CLIENTE',
        senderId: profile.id,
        message: messageText,
        messageType: 'TEXT',
      })

      // Recargar mensajes inmediatamente después de enviar
      await loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      // Restaurar el mensaje en caso de error
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isEnabled) {
    return (
      <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t-xl">
          <h3 className="font-semibold text-gray-400">💬 Chat</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-3 opacity-50">💬</div>
            <p className="text-gray-400 text-sm">
              El chat estará disponible cuando el repartidor inicie el viaje
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Chat con tu Repartidor
            </h3>
            <span className="text-xs text-green-600 dark:text-green-400">● En línea</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 min-h-[350px] max-h-[400px] overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-sm">Cargando mensajes...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <p>No hay mensajes aún. ¡Saluda a tu repartidor!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'customer'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-[10px] ${
                    message.sender === 'customer'
                      ? 'text-white/70'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
