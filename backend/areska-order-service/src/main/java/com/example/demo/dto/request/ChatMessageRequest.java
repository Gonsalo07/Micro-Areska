package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    
    @NotNull(message = "Order ID is required")
    @Positive(message = "Order ID must be a positive number")
    private Integer orderId;
    
    @NotBlank(message = "Sender type is required")
    @Pattern(regexp = "CLIENTE|ADMIN|DELIVERY_DRIVER", 
             message = "Sender type must be CLIENTE, ADMIN, or DELIVERY_DRIVER")
    private String senderType;
    
    @NotNull(message = "Sender ID is required")
    @Positive(message = "Sender ID must be a positive number")
    private Integer senderId;
    
    @NotBlank(message = "Message is required")
    @Size(max = 5000, message = "Message must not exceed 5000 characters")
    private String message;
    
    @Pattern(regexp = "TEXT|IMAGE|LOCATION", 
             message = "Message type must be TEXT, IMAGE, or LOCATION")
    private String messageType; // Default will be TEXT if not provided
}
