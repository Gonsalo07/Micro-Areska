package com.example.demo.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class OrderCreateRequest {
	@NotNull(message = "User ID is required")
	@Positive(message = "User ID must be a positive number")
	private Integer userId;
	
	@NotBlank(message = "Pickup method is required")
	@Size(max = 50, message = "Pickup method must not exceed 50 characters")
	private String pickupMethod;
	
	// Opcional
	@Valid
	private List<OrderItemRequest> items;
	
	// Opcional - solo necesario si pickupMethod es "delivery"
	@Size(max = 500, message = "Delivery address must not exceed 500 characters")
	private String deliveryAddress;
}

