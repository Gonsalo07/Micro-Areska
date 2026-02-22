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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.OrderCreateRequest;
import com.example.demo.dto.request.OrderUpdateRequest;
import com.example.demo.dto.response.OrderResponse;
import com.example.demo.service.OrderService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Operations related to orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "List all orders")
    public ResponseEntity<ApiSuccess<List<OrderResponse>>> list() {
        List<OrderResponse> orders = orderService.getList();
        ApiSuccess<List<OrderResponse>> response = new ApiSuccess<>(
                orders.isEmpty() ? "No orders found" : "Orders listed successfully",
                orders);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an order by ID (with items)")
    public ResponseEntity<ApiSuccess<OrderResponse>> get(@Min(1) @PathVariable Integer id) {
        OrderResponse order = orderService.getDetailById(id);
        return ResponseEntity.ok(new ApiSuccess<>("Order found", order));
    }

    @GetMapping("/user-by-firebase-uid/{firebaseUid}")
    @Operation(summary = "List all orders for a specific user using their Firebase UID")
    public ResponseEntity<ApiSuccess<List<OrderResponse>>> getByFirebaseUid(@PathVariable String firebaseUid) {
        List<OrderResponse> orders = orderService.getOrdersByFirebaseUid(firebaseUid);
        ApiSuccess<List<OrderResponse>> response = new ApiSuccess<>(
                orders.isEmpty() ? "No orders found" : "Orders listed successfully",
                orders);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "List all orders for a specific user")
    public ResponseEntity<ApiSuccess<List<OrderResponse>>> getByUser(@Min(1) @PathVariable Integer userId) {
        List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
        ApiSuccess<List<OrderResponse>> response = new ApiSuccess<>(
                orders.isEmpty() ? "No orders found" : "Orders listed successfully",
                orders);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a new order")
    public ResponseEntity<ApiSuccess<OrderResponse>> create(@Valid @RequestBody OrderCreateRequest request) {
        OrderResponse created = orderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiSuccess<>("Order created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an order status method")
    public ResponseEntity<ApiSuccess<OrderResponse>> update(@Min(1) @PathVariable Integer id, @Valid @RequestBody OrderUpdateRequest request) {
        OrderResponse updated = orderService.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Order updated successfully", updated));
    }
}