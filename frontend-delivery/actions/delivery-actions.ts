"use server";

import { Delivery, DeliveryStatus } from "@/types/delivery.types";
import { revalidatePath } from "next/cache";

const API_GAMEWAY_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // In a real app, retrieve token from cookies/headers
    // const token = cookies().get("token")?.value;
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        // "Authorization": `Bearer ${token}`
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }
    return res.json();
}

export async function getActiveDelivery(driverId: string): Promise<Delivery | null> {
    try {
        // Since we don't have a direct "active" endpoint, we might filter or assume the backend provides one.
        // For now, let's try to fetch assignments for the driver and pick the active one.
        // Adjust endpoint based on backend capabilities.
        // Strategy: Get all for driver, filter locally.
        
        // This endpoint logic is inferred. You might need to adjust "driver/{id}"
        // If backend lacks this, we might need to query by order status or similar.
        const response = await fetchWithAuth(`${API_GAMEWAY_URL}/order-deliveries`); 
        const allDeliveries = response.data || [];
        
        // Filter for this driver and active status locally
        const activeDelivery = allDeliveries.find((d: any) => 
            d.deliveryDriverId?.toString() === driverId && 
            ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED'].includes(d.status)
        );

        if (!activeDelivery) {
            // Check if there is an explicit "active" endpoint or maybe "assigned"?
            // If not found, return null
            return null;
        }

        return mapToDelivery(activeDelivery);
    } catch (error) {
        console.error("Error fetching active delivery:", error);
        return null;
    }
}

export async function updateDeliveryStatus(deliveryId: string, status: DeliveryStatus) {
    try {
        // PUT /order-deliveries/{id}/status?status=...
        // or PUT /order-deliveries/{id} body: {status: ...}
        // Based on snippet: @PutMapping("/order/{orderId}/status") but we have deliveryId here.
        // Let's use the update endpoint for delivery detail id: PUT /order-deliveries/{id}
        
        await fetchWithAuth(`${API_GAMEWAY_URL}/order-deliveries/${deliveryId}`, {
            method: "PUT",
            body: JSON.stringify({ status })
        });
        
        revalidatePath("/en-ruta");
        revalidatePath("/pedidos");
        return { success: true };
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
}

function mapToDelivery(data: any): Delivery {
    return {
        id: data.id.toString(),
        orderId: data.orderId.toString(),
        driverId: data.deliveryDriverId?.toString(),
        status: data.status,
        pickupAddress: data.pickupAddress || "Dirección de recogida desconocida", 
        deliveryAddress: data.deliveryAddress || "Dirección de entrega desconocida",
        deliveryFee: data.deliveryFee || 0,
        totalDistance: 0, // Backend might not send this yet
        estimatedTime: 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
    };
}
