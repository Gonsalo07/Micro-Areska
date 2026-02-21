package com.example.demo.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record DeliveryDriverNotificationResponse(
    Integer id,
    Integer deliveryDriverId,
    String title,
    String message,
    String type,
    Integer relatedOrderId,
    Boolean isRead,
    
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
    LocalDateTime createdAt
) {}
