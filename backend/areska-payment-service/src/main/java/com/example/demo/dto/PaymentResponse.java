package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
    Integer id,
    Integer orderId,
    String method,
    BigDecimal amount,
    LocalDateTime paymentDate
) {}
