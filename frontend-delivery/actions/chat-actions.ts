"use server";

import { ChatMessage } from "@/types/delivery.types";

const API_GAMEWAY_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
}

export async function getChatMessages(orderId: string): Promise<ChatMessage[]> {
    try {
        const response = await fetchWithAuth(`${API_GAMEWAY_URL}/chat-messages/order/${orderId}`);
        return (response.data || []).map((msg: any) => ({
            id: msg.id.toString(),
            orderId: msg.orderId.toString(),
            senderId: msg.senderId.toString(),
            message: msg.message,
            createdAt: msg.sentAt || new Date().toISOString(),
            isRead: msg.readAt != null,
            senderType: msg.senderType
        }));
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        return [];
    }
}

export async function createChatMessage(orderId: string, message: string, senderId?: string): Promise<ChatMessage | null> {
    try {
        // Assume senderId is available via auth store on client, but here server action context might need it via session if secure.
        // For simplicity, passing it or assuming backend infers from token.
        // If senderId is required by backend explicitly:
        if (!senderId) {
             // In real app, get from session
             senderId = "1"; // Fallback for dev
        }
        
        const payload = {
            orderId: parseInt(orderId),
            senderId: parseInt(senderId), // Assuming numeric IDs in backend
            message,
            senderType: "DELIVERY_DRIVER" // Fixed type
        };

        const response = await fetchWithAuth(`${API_GAMEWAY_URL}/chat-messages`, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const data = response.data;
        return {
            id: data.id.toString(),
            orderId: data.orderId.toString(),
            senderId: data.senderId.toString(),
            message: data.message,
            createdAt: data.sentAt,
            isRead: false,
            senderType: data.senderType
        };
    } catch (error) {
        console.error("Error creating chat message:", error);
        return null;
    }
}
