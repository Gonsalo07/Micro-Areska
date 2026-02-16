package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DeliveryResponse;
import com.example.demo.dto.DeliveryUpdateRequest;
import com.example.demo.service.DeliveryService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/deliveries")
@RequiredArgsConstructor
@Tag(name = "Deliveries", description = "Operations related to deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    @Operation(summary = "List all deliveries")
    public ResponseEntity<ApiSuccess<List<DeliveryResponse>>> getAll() {
        List<DeliveryResponse> deliveries = deliveryService.getAll();
        ApiSuccess<List<DeliveryResponse>> response = new ApiSuccess<>(
                deliveries.isEmpty() ? "No deliveries found" : "Deliveries listed successfully",
                deliveries);
        HttpStatus status = deliveries.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a delivery by ID")
    public ResponseEntity<ApiSuccess<DeliveryResponse>> getById(@Min(1) @PathVariable Integer id) {
        DeliveryResponse delivery = deliveryService.getById(id);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery found", delivery));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get deliveries by order ID")
    public ResponseEntity<ApiSuccess<List<DeliveryResponse>>> getByOrderId(@Min(1) @PathVariable Integer orderId) {
        List<DeliveryResponse> deliveries = deliveryService.getByOrderId(orderId);
        ApiSuccess<List<DeliveryResponse>> response = new ApiSuccess<>(
                deliveries.isEmpty() ? "No deliveries found for this order" : "Deliveries listed successfully",
                deliveries);
        HttpStatus status = deliveries.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get deliveries by user ID")
    public ResponseEntity<ApiSuccess<List<DeliveryResponse>>> getByUserId(@Min(1) @PathVariable Integer userId) {
        List<DeliveryResponse> deliveries = deliveryService.getByUserId(userId);
        ApiSuccess<List<DeliveryResponse>> response = new ApiSuccess<>(
                deliveries.isEmpty() ? "No deliveries found for this user" : "Deliveries listed successfully",
                deliveries);
        HttpStatus status = deliveries.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get deliveries by status")
    public ResponseEntity<ApiSuccess<List<DeliveryResponse>>> getByStatus(@PathVariable String status) {
        List<DeliveryResponse> deliveries = deliveryService.getByStatus(status);
        ApiSuccess<List<DeliveryResponse>> response = new ApiSuccess<>(
                deliveries.isEmpty() ? "No deliveries found with this status" : "Deliveries listed successfully",
                deliveries);
        HttpStatus statusCode = deliveries.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return ResponseEntity.status(statusCode).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a delivery by ID")
    public ResponseEntity<ApiSuccess<DeliveryResponse>> update(@Min(1) @PathVariable Integer id,
            @Valid @RequestBody DeliveryUpdateRequest request) {
        DeliveryResponse updated = deliveryService.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a delivery by ID")
    public ResponseEntity<?> delete(@Min(1) @PathVariable Integer id) {
        deliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
