package com.example.demo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ProductRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 200, message = "Name must not exceed 200 characters")
    String name,

    String description,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal price,

    BigDecimal originalPrice,

    @Size(max = 500, message = "Main image URL must not exceed 500 characters")
    String mainImage,

    Integer stock,

    @Size(max = 50, message = "Badge must not exceed 50 characters")
    String badge,

    Integer categoryId
) {}
