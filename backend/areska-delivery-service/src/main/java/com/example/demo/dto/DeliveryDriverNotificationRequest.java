package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record DeliveryDriverNotificationRequest(
    @NotNull(message = "Delivery driver ID is required")
    @Positive(message = "Delivery driver ID must be positive")
    Integer deliveryDriverId,

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    String title,

    @NotBlank(message = "Message is required")
    String message,

    @Size(max = 50, message = "Type must not exceed 50 characters")
    String type,

    Integer relatedOrderId
) {}
