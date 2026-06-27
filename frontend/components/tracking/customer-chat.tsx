'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { MessageCircle, Send } from 'lucide-react'

import { useAuthStore } from '@auth/stores/auth.store'
import { chatApi, type ChatMessage } from '@public/api/chat'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

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

  const mapChatMessage = (msg: ChatMessage): Message => ({
    id: msg.id.toString(),
    text: msg.message,
    sender: msg.senderType === 'DELIVERY_DRIVER' ? 'driver' : 'customer',
    timestamp: new Date(msg.sentAt),
  })

  const loadMessages = useCallback(async () => {
    if (!orderId || !isEnabled) return

    try {
      setLoading(true)
      const chatMessages = await chatApi.getByOrderId(orderId)

      if (!Array.isArray(chatMessages)) {
        console.error('Invalid chat messages response:', chatMessages)
        setMessages([])
        return
      }

      const mappedMessages = chatMessages.map(mapChatMessage)
      setMessages(mappedMessages)

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

  useEffect(() => {
    if (isEnabled && orderId) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [isEnabled, orderId, loadMessages])

  useEffect(() => {
    if (!isEnabled || !orderId) return

    const interval = setInterval(async () => {
      try {
        const chatMessages = await chatApi.getByOrderId(orderId)

        if (!Array.isArray(chatMessages)) {
          return
        }

        const mappedMessages = chatMessages.map(mapChatMessage)

        if (JSON.stringify(mappedMessages) !== JSON.stringify(messages)) {
          setMessages(mappedMessages)

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

      await loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
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
      <div className="flex h-full min-h-[320px] flex-1 flex-col items-center justify-center gap-3 bg-muted/30 px-6 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <MessageCircle className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          El chat estará disponible cuando el repartidor inicie el viaje.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[320px] flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No hay mensajes aún. ¡Saluda a tu repartidor!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                  message.sender === 'customer'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm border bg-card text-card-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-[10px] ${
                    message.sender === 'customer'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
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

      <div className="mt-auto shrink-0 border-t bg-card p-3">
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
            size="icon"
          >
            {sending ? <Spinner className="size-4" /> : <Send className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
