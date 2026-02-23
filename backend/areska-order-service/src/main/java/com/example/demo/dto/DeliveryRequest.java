package com.example.demo.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {
    private Integer orderId;
    private Integer userId;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private BigDecimal destinationLat;
    private BigDecimal destinationLng;
    private String notes;
}

