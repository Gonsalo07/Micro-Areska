package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload enviado por WebSocket a todos los drivers disponibles
 * cuando llega una nueva orden pendiente de asignación.
 * Topic: /topic/orders/available
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewOrderNotification {

    private Integer deliveryId;
    private Integer orderId;
    private String customerName;
    private String customerPhone;
    private String destinationAddress;
    private BigDecimal destinationLat;
    private BigDecimal destinationLng;
    private String customerNotes;
    private LocalDateTime createdAt;
}
