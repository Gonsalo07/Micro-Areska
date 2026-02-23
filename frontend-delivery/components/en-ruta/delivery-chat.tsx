"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Input, Avatar, Spinner } from "@nextui-org/react";
import { chatMessagesApi, type ChatMessage } from "@/features/delivery/api/chat-messages";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { OrderDeliveryDetailResponse } from "@/lib/types/order";

interface Message {
  id: string;
  text: string;
  sender: "driver" | "customer";
  timestamp: Date;
}

interface DeliveryChatProps {
  isChatEnabled: boolean;
  delivery?: OrderDeliveryDetailResponse;
}

export const DeliveryChat = ({ isChatEnabled, delivery }: DeliveryChatProps) => {
  const { driver } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convertir mensajes de la API al formato del componente
  const mapChatMessage = (msg: ChatMessage): Message => ({
    id: msg.id.toString(),
    text: msg.message,
    sender: msg.senderType === "DELIVERY_DRIVER" ? "driver" : "customer",
    timestamp: new Date(msg.sentAt),
  });

  // Cargar mensajes de la orden
  const loadMessages = useCallback(async () => {
    if (!delivery?.orderId || !isChatEnabled) return;

    try {
      setLoading(true);
      const chatMessages = await chatMessagesApi.getByOrderId(delivery.orderId);
      const mappedMessages = chatMessages.map(mapChatMessage);
      setMessages(mappedMessages);
      
      // Marcar todos como leídos
      const unreadMessages = chatMessages.filter(msg => !msg.readAt && msg.senderType !== "DELIVERY_DRIVER");
      if (unreadMessages.length > 0) {
        await chatMessagesApi.markAllAsRead(delivery.orderId);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, [delivery?.orderId, isChatEnabled]);

  // Cargar mensajes cuando el chat se habilita
  useEffect(() => {
    if (isChatEnabled && delivery?.orderId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [isChatEnabled, delivery?.orderId, loadMessages]);

  // Polling para nuevos mensajes cada 5 segundos
  useEffect(() => {
    if (!isChatEnabled || !delivery?.orderId) return;

    const interval = setInterval(async () => {
      try {
        const chatMessages = await chatMessagesApi.getByOrderId(delivery.orderId);
        const mappedMessages = chatMessages.map(mapChatMessage);
        
        // Solo actualizar si hay cambios
        if (JSON.stringify(mappedMessages) !== JSON.stringify(messages)) {
          setMessages(mappedMessages);
          
          // Marcar nuevos mensajes como leídos
          const unreadMessages = chatMessages.filter(msg => !msg.readAt && msg.senderType !== "DELIVERY_DRIVER");
          if (unreadMessages.length > 0) {
            await chatMessagesApi.markAllAsRead(delivery.orderId);
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isChatEnabled, delivery?.orderId, messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isChatEnabled || !delivery?.orderId || !driver?.id) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      await chatMessagesApi.sendMessage({
        orderId: delivery.orderId,
        senderType: "DELIVERY_DRIVER",
        senderId: driver.id,
        message: messageText,
        messageType: "TEXT",
      });

      // Recargar mensajes inmediatamente después de enviar
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      // Restaurar el mensaje en caso de error
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isChatEnabled) {
    return (
      <div className="w-80 flex flex-col bg-default-50 rounded-lg border border-default-200">
        <div className="p-4 border-b border-default-200 bg-default-100 rounded-t-lg">
          <h3 className="font-semibold text-default-400">💬 Chat</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-3 opacity-50">💬</div>
            <p className="text-default-400 text-sm">
              {delivery?.orderId 
                ? "El chat se habilitará cuando inicies el viaje"
                : "El chat estará disponible cuando tengas una orden activa"
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-default-50 rounded-lg border border-default-200">
    {/* Header */}
    <div className="p-4 border-b border-default-200 bg-primary/5 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar
            src="https://i.pravatar.cc/150?u=customer123"
            size="sm"
            className="ring-2 ring-success ring-offset-2"
          />
          <div>
            <h3 className="font-semibold text-sm">{delivery?.customerName || 'Cliente'}</h3>
            <span className="text-xs text-success">En línea</span>
          </div>
        </div>
      </div>

       {/* Messages */}
    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="sm" label="Cargando mensajes..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-default-400 text-sm">
            <p>No hay mensajes aún. ¡Inicia la conversación!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "driver" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === "driver"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-default-200 text-default-800 rounded-bl-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-[10px] ${
                    message.sender === "driver"
                      ? "text-white/70"
                      : "text-default-400"
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
    <div className="p-3 border-t border-default-200">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="sm"
            isDisabled={sending}
            classNames={{
              input: "text-sm",
            }}
          />
          <Button
            isIconOnly
            color="primary"
            size="sm"
            onClick={handleSendMessage}
            isDisabled={!newMessage.trim() || sending}
            isLoading={sending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
