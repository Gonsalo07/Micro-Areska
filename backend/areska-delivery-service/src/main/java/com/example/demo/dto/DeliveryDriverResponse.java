package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DeliveryDriverResponse(
    Integer id,
    String fullName,
    String phone,
    String email,
    String firebaseUid,
    String authProvider,
    Boolean emailVerified,
    String photoUrl,
    String vehicleType,
    String licenseNumber,
    String companyName,
    Boolean isAvailable,
    Boolean isActive,
    BigDecimal currentLat,
    BigDecimal currentLng,
    LocalDateTime lastLocationUpdate,
    LocalDateTime createdAt
) {}
