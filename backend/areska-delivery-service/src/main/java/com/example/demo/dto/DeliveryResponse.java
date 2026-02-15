package com.example.demo.dto;

import java.time.LocalDateTime;

public record DeliveryResponse(
    Integer id,
    Integer orderId,
    Integer userId,
    String deliveryAddress,
    String notes,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
