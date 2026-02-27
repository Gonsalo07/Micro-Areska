"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import useSWR from "swr";
import { createChatMessage, getChatMessages } from "@/actions/chat-actions";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { toast } from "sonner";

interface Message {
  id: string;
  orderId: string;
  senderId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface DeliveryChatProps {
  deliveryId: string;
}

export default function DeliveryChat({ deliveryId }: DeliveryChatProps) {
  const { driver } = useAuthStore();
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], mutate } = useSWR(
    deliveryId ? `/api/chat/${deliveryId}` : null,
    () => getChatMessages(deliveryId),
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !driver) return;

    const tempId = Date.now().toString();
    const driverId = driver.id.toString();
    const optimisticMsg: Message = {
      id: tempId,
      orderId: deliveryId,
      senderId: driverId,
      message: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    const textToSend = newMessage;
    setNewMessage("");

    try {
      await mutate(
        async (current: Message[] = []) => {
          await createChatMessage(deliveryId, textToSend, driverId);
          return [...current, optimisticMsg];
        },
        {
          optimisticData: (current: Message[] = []) => [...current, optimisticMsg],
          rollbackOnError: true,
          revalidate: true,
        }
      );
    } catch {
      toast.error("Error al enviar mensaje");
      setNewMessage(textToSend);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-900/50"
        style={{ maxHeight: "calc(100% - 72px)" }}
      >
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-400 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-4 rounded-3xl bg-white dark:bg-zinc-800 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-zinc-700">
                <MessageCircle size={32} className="text-primary-500 opacity-80" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Chat con el cliente
              </p>
              <p className="text-xs text-gray-500">
                Envía un mensaje para coordinar la entrega.
              </p>
            </div>
          ) : (
            messages.map((msg: Message) => {
              const isMe = msg.senderId === driver?.id?.toString();
              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex flex-col max-w-[85%] gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all ${
                      isMe
                        ? "bg-primary text-white rounded-br-sm shadow-primary/20"
                        : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-zinc-700"
                    }`}
                  >
                    <p className="leading-snug">{msg.message}</p>
                    <span
                      className={`text-[10px] ${
                        isMe ? "text-primary-100" : "text-gray-400"
                      } self-end font-medium mt-0.5`}
                    >
                      {format(new Date(msg.createdAt), "HH:mm", { locale: es })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-100 p-3 dark:border-gray-800 bg-white dark:bg-zinc-900"
      >
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onValueChange={setNewMessage}
            variant="faded"
            radius="full"
            classNames={{
              inputWrapper:
                "bg-gray-50 dark:bg-zinc-800 shadow-none hover:bg-gray-100 dark:hover:bg-zinc-700",
            }}
          />
          <Button
            isIconOnly
            color="primary"
            radius="full"
            size="sm"
            type="submit"
            isDisabled={!newMessage.trim()}
          >
            <Send size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
