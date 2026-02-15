package com.example.demo.dto;

import java.time.LocalDateTime;

public record UserResponse(
    Integer id,
    String firstName,
    String lastName,
    String email,
    String phone,
    String address,
    String firebaseUid,
    String authProvider,
    Boolean emailVerified,
    String photoUrl,
    LocalDateTime createdAt
) {}
