package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OrderDeliveryDetailRequest;
import com.example.demo.dto.OrderDeliveryDetailResponse;
import com.example.demo.dto.OrderDeliveryDetailUpdateRequest;
import com.example.demo.dto.DriverHistoryPageResponse;
import com.example.demo.service.OrderDeliveryDetailService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;

@Validated
@RestController
@RequestMapping("/order-deliveries")
@RequiredArgsConstructor
@Tag(name = "Order Delivery Details", description = "Operations related to order delivery details")
public class OrderDeliveryDetailController {

    private final OrderDeliveryDetailService service;

    @GetMapping
    @Operation(summary = "List all order delivery details")
    public ResponseEntity<ApiSuccess<List<OrderDeliveryDetailResponse>>> getAll() {
        List<OrderDeliveryDetailResponse> details = service.getAll();
        ApiSuccess<List<OrderDeliveryDetailResponse>> response = new ApiSuccess<>(
                details.isEmpty() ? "No delivery details found" : "Delivery details listed successfully",
                details);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get delivery detail by ID")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> getById(@Min(1) @PathVariable Integer id) {
        OrderDeliveryDetailResponse detail = service.getById(id);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery detail found", detail));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get delivery detail by order ID")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> getByOrderId(@Min(1) @PathVariable Integer orderId) {
        OrderDeliveryDetailResponse detail = service.getByOrderId(orderId);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery detail found", detail));
    }

    @GetMapping("/driver/{driverId}")
    @Operation(summary = "Get all delivery details for a driver")
    public ResponseEntity<ApiSuccess<List<OrderDeliveryDetailResponse>>> getByDriverId(@Min(1) @PathVariable Integer driverId) {
        List<OrderDeliveryDetailResponse> details = service.getByDriverId(driverId);
        ApiSuccess<List<OrderDeliveryDetailResponse>> response = new ApiSuccess<>(
                details.isEmpty() ? "No deliveries found for driver" : "Deliveries listed successfully",
                details);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/driver/{driverId}/history")
    @Operation(summary = "Get paginated delivery history for a driver (delivered/cancelled)")
    public ResponseEntity<ApiSuccess<DriverHistoryPageResponse>> getDriverHistory(
            @Min(1) @PathVariable Integer driverId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        DriverHistoryPageResponse history = service.getDriverHistory(driverId, search, page, size);
        ApiSuccess<DriverHistoryPageResponse> response = new ApiSuccess<>(
                history.content().isEmpty() ? "No delivery history found" : "Delivery history listed successfully",
                history);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/driver/{driverId}/active")
    @Operation(summary = "Get active deliveries for a driver (assigned, accepted, in transit)")
    public ResponseEntity<ApiSuccess<List<OrderDeliveryDetailResponse>>> getActiveByDriverId(@Min(1) @PathVariable Integer driverId) {
        List<OrderDeliveryDetailResponse> details = service.getActiveByDriverId(driverId);
        ApiSuccess<List<OrderDeliveryDetailResponse>> response = new ApiSuccess<>(
                details.isEmpty() ? "No active deliveries found" : "Active deliveries listed successfully",
                details);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get all pending assignment deliveries")
    public ResponseEntity<ApiSuccess<List<OrderDeliveryDetailResponse>>> getPendingAssignment() {
        List<OrderDeliveryDetailResponse> details = service.getPendingAssignment();
        ApiSuccess<List<OrderDeliveryDetailResponse>> response = new ApiSuccess<>(
                details.isEmpty() ? "No pending deliveries found" : "Pending deliveries listed successfully",
                details);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get deliveries by status")
    public ResponseEntity<ApiSuccess<List<OrderDeliveryDetailResponse>>> getByStatus(@PathVariable String status) {
        List<OrderDeliveryDetailResponse> details = service.getByStatus(status);
        ApiSuccess<List<OrderDeliveryDetailResponse>> response = new ApiSuccess<>(
                details.isEmpty() ? "No deliveries found with status: " + status : "Deliveries listed successfully",
                details);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a new delivery detail (usually done via RabbitMQ)")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> create(@Valid @RequestBody OrderDeliveryDetailRequest request) {
        OrderDeliveryDetailResponse detail = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Delivery detail created successfully", detail));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update delivery detail (status, driver notes, assign driver)")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> update(
            @Min(1) @PathVariable Integer id,
            @Valid @RequestBody OrderDeliveryDetailUpdateRequest request) {
        OrderDeliveryDetailResponse detail = service.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery detail updated successfully", detail));
    }

    @PutMapping("/{id}/assign/{driverId}")
    @Operation(summary = "Assign a driver to a delivery")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> assignDriver(
            @Min(1) @PathVariable Integer id,
            @Min(1) @PathVariable Integer driverId) {
        OrderDeliveryDetailResponse detail = service.assignDriver(id, driverId);
        return ResponseEntity.ok(new ApiSuccess<>("Driver assigned successfully", detail));
    }

    @PostMapping("/{id}/accept/{driverId}")
    @Operation(summary = "Driver accepts a pending order (first come, first served)")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> acceptOrder(
            @Min(1) @PathVariable Integer id,
            @Min(1) @PathVariable Integer driverId) {
        try {
            OrderDeliveryDetailResponse detail = service.acceptOrder(id, driverId);
            return ResponseEntity.ok(new ApiSuccess<>("Order accepted successfully", detail));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409)
                    .body(new ApiSuccess<>("Order already taken by another driver", null));
        }
    }

    @PutMapping("/order/{orderId}/status")
    @Operation(summary = "Update delivery status by order ID")
    public ResponseEntity<ApiSuccess<OrderDeliveryDetailResponse>> updateStatusByOrderId(
            @Min(1) @PathVariable Integer orderId,
            @RequestParam String status,
            @RequestParam(required = false) String cancellationReason) {
        OrderDeliveryDetailResponse detail = service.updateStatusByOrderId(orderId, status, cancellationReason);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery status updated successfully", detail));
    }
}
