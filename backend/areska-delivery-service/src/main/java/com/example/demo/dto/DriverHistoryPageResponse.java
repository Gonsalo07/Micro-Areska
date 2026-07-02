package com.example.demo.dto;

import java.util.List;

public record DriverHistoryPageResponse(
    List<OrderDeliveryDetailResponse> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    long deliveredCount,
    long cancelledCount
) {}
