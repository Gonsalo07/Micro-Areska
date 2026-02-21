package com.example.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "id", "userId", "deliveryDriverId", "orderDate", "status", "deliveryStatus", 
                     "total", "pickupMethod", "assignedAt", "acceptedAt", "outForDeliveryAt", 
                     "arrivedAt", "deliveredAt", "cancelledAt", "updatedAt", "items" })
public record OrderResponse(
        Integer id,
        Integer userId,
        Integer deliveryDriverId,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime orderDate,
        
        String status,
        String deliveryStatus,
        BigDecimal total,
        String pickupMethod,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime assignedAt,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime acceptedAt,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime outForDeliveryAt,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime arrivedAt,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime deliveredAt,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime cancelledAt,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime updatedAt,
        
        List<OrderDetailReponse> items
) { }