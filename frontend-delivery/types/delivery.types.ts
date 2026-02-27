export type DeliveryStatus = "SEARCHING" | "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  status: DeliveryStatus;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryFee: number;
  totalDistance: number;
  estimatedTime: number; // in minutes
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  customerPhone?: string;
}

export interface ChatMessage {
    id: string;
    orderId: string;
    senderId: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    senderType?: "DELIVERY_DRIVER" | "CUSTOMER" | "SYSTEM";
}
