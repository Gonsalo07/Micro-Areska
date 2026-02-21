package com.example.demo.dto.response;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Integer id,
        Integer orderId,
        String senderType,
        Integer senderId,
        String message,
        String messageType,
        LocalDateTime sentAt,
        LocalDateTime readAt,
        Boolean isRead
) {
}
