package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response con el detalle completo de entrega.
 */
public record OrderDeliveryDetailResponse(
    Integer id,
    Integer orderId,
    
    // Driver info (puede ser null si no está asignado)
    Integer deliveryDriverId,
    String driverName,
    String driverPhone,
    String driverPhotoUrl,
    BigDecimal driverCurrentLat,
    BigDecimal driverCurrentLng,
    
    // Customer info (desde la orden)
    String customerName,
    String customerPhone,
    
    // Destino
    String destinationAddress,
    BigDecimal destinationLat,
    BigDecimal destinationLng,
    String destinationReference,
    
    // Comentarios
    String customerNotes,
    String driverNotes,
    
    // Estado
    String status,
    
    // Timestamps
    LocalDateTime assignedAt,
    LocalDateTime acceptedAt,
    LocalDateTime pickedUpAt,
    LocalDateTime outForDeliveryAt,
    LocalDateTime arrivedAt,
    LocalDateTime deliveredAt,
    LocalDateTime cancelledAt,
    String cancellationReason,
    
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
