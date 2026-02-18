package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    String firstName,

    @Size(max = 100, message = "Last name must not exceed 100 characters")
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    String email,

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    String phone,

    String address,

    @Size(max = 255, message = "Firebase UID must not exceed 255 characters")
    String firebaseUid,

    @Size(max = 50, message = "Auth provider must not exceed 50 characters")
    String authProvider,

    Boolean emailVerified,

    @Size(max = 500, message = "Photo URL must not exceed 500 characters")
    String photoUrl
) {}
