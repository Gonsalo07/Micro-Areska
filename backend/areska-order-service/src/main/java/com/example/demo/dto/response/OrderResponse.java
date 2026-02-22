package com.example.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "id", "userId", "orderDate", "status", "total", "pickupMethod", "updatedAt", "items" })
public record OrderResponse(
        Integer id,
        Integer userId,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime orderDate,
        
        String status,
        BigDecimal total,
        String pickupMethod,
        
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm", timezone = "America/Lima")
        LocalDateTime updatedAt,
        
        List<OrderDetailReponse> items
) { }