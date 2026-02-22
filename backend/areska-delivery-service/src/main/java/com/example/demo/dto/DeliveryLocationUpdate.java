package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para enviar actualizaciones de ubicación del delivery por WebSocket
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryLocationUpdate {
    
    private Integer deliveryId;
    private Integer orderId;
    private Double latitude;
    private Double longitude;
    private Long timestamp;
    
    // Opcional: información del repartidor
    private String driverName;
    
    // Opcional: información de la ruta
    private String estimatedDistance; // ej: "2.5 km"
    private String estimatedDuration; // ej: "8 mins"
}
