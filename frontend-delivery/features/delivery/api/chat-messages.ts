import { ApiClient } from '@/lib/api/client'

export interface ChatMessage {
  id: number
  orderId: number
  senderType: 'CLIENTE' | 'ADMIN' | 'DELIVERY_DRIVER'
  senderId: number
  message: string
  messageType: 'TEXT' | 'IMAGE' | 'LOCATION'
  sentAt: string
  readAt?: string
}

export interface SendMessageRequest {
  orderId: number
  senderType: 'CLIENTE' | 'ADMIN' | 'DELIVERY_DRIVER'
  senderId: number
  message: string
  messageType?: 'TEXT' | 'IMAGE' | 'LOCATION'
}

const apiClient = new ApiClient()

export const chatMessagesApi = {
  /**
   * Obtener todos los mensajes de una orden
   */
  async getByOrderId(orderId: number): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`/chat-messages/order/${orderId}`)
  },

  /**
   * Obtener mensajes no leídos de una orden
   */
  async getUnreadByOrderId(orderId: number): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(`/chat-messages/order/${orderId}/unread`)
  },

  /**
   * Enviar un nuevo mensaje
   */
  async sendMessage(request: SendMessageRequest): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>('/chat-messages', request)
  },

  /**
   * Marcar un mensaje como leído
   */
  async markAsRead(messageId: number): Promise<ChatMessage> {
    return apiClient.put<ChatMessage>(`/chat-messages/${messageId}/read`)
  },

  /**
   * Marcar todos los mensajes de una orden como leídos
   */
  async markAllAsRead(orderId: number): Promise<ChatMessage[]> {
    return apiClient.put<ChatMessage[]>(`/chat-messages/order/${orderId}/read-all`)
  },

  /**
   * Eliminar un mensaje
   */
  async deleteMessage(messageId: number): Promise<void> {
    return apiClient.delete(`/chat-messages/${messageId}`)
  },
}
