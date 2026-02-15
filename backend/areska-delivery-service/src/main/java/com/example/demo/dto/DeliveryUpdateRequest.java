package com.example.demo.dto;

import jakarta.validation.constraints.Size;

public record DeliveryUpdateRequest(
    @Size(max = 50, message = "Status must not exceed 50 characters")
    String status,
    
    String notes
) {}
