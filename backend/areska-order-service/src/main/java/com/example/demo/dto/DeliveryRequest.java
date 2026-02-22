package com.example.demo.dto;

public record DeliveryRequest(
	    Integer orderId,
	    Integer userId,
	    String customerName,
	    String customerPhone,
	    String deliveryAddress,
	    String notes
	) {}

