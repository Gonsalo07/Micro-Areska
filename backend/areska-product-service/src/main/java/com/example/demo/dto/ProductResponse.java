package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
    Integer id,
    String name,
    String description,
    BigDecimal price,
    BigDecimal originalPrice,
    String mainImage,
    Integer stock,
    String badge,
    ProductCategory category,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public record ProductCategory(
        Integer id,
        String name
    ) {}
}
