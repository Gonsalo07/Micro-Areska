package com.example.demo.dto;

public record DeliveryRequest(
    Integer orderId,
    Integer userId,
    String deliveryAddress,
    String notes
) {}
