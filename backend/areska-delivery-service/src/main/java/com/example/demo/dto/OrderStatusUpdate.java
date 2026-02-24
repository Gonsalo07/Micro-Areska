package com.example.demo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload enviado al cliente por WebSocket cuando el estado de la ORDEN cambia.
 * Topic: /topic/order/{orderId}/status
 * Publicado por el delivery-service en los estados terminales (DELIVERED, CANCELLED).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdate {

    private Integer orderId;
    private String status;
    private String statusLabel;
    private String message;
    private LocalDateTime changedAt;
}
