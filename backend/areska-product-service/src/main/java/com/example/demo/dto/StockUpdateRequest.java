package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StockUpdateRequest(
    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be 0 or greater")
    Integer stock
) {}
