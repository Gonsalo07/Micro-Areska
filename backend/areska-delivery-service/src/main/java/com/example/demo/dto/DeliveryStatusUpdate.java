package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload enviado al cliente por WebSocket cuando el estado de la entrega cambia.
 * Topic: /topic/order/{orderId}/tracking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryStatusUpdate {

    private Integer deliveryId;
    private Integer orderId;
    private String status;
    private String statusLabel;
    private String message;
    private String driverName;
    private String driverPhone;
    private String driverPhotoUrl;
    private BigDecimal driverLat;
    private BigDecimal driverLng;
    private LocalDateTime changedAt;
}
