package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DeliveryDriverRequest(
    @NotBlank(message = "Full name is required")
    @Size(max = 150, message = "Full name must not exceed 150 characters")
    String fullName,

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    String phone,

    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    String email,

    String firebaseUid,
    String authProvider,
    Boolean emailVerified,
    String photoUrl,

    @Size(max = 50, message = "Vehicle type must not exceed 50 characters")
    String vehicleType,

    @Size(max = 100, message = "License number must not exceed 100 characters")
    String licenseNumber,

    @Size(max = 150, message = "Company name must not exceed 150 characters")
    String companyName
) {}
