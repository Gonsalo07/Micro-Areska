package com.example.demo.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request para crear un nuevo detalle de entrega.
 * Normalmente se crea automáticamente cuando llega un mensaje de RabbitMQ.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDeliveryDetailRequest {
    
    private Integer orderId;
    private String customerName;
    private String customerPhone;
    private String destinationAddress;
    private BigDecimal destinationLat;
    private BigDecimal destinationLng;
    private String destinationReference;
    private String customerNotes;
}
