package com.example.demo.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class OrderUpdateRequest {
    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;
    
    @Size(max = 30, message = "Delivery status must not exceed 30 characters")
    private String deliveryStatus;
    
    private Integer deliveryDriverId;
}