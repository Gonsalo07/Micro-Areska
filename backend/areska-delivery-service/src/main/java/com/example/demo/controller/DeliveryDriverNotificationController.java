package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DeliveryDriverNotificationRequest;
import com.example.demo.dto.DeliveryDriverNotificationResponse;
import com.example.demo.service.DeliveryDriverNotificationService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/delivery-driver-notifications")
@RequiredArgsConstructor
@Tag(name = "Delivery Driver Notifications", description = "Notification management for delivery drivers")
public class DeliveryDriverNotificationController {

    private final DeliveryDriverNotificationService notificationService;

    @PostMapping
    @Operation(summary = "Create a new notification for a delivery driver")
    public ResponseEntity<ApiSuccess<DeliveryDriverNotificationResponse>> create(
            @Valid @RequestBody DeliveryDriverNotificationRequest request) {
        DeliveryDriverNotificationResponse created = notificationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Notification created successfully", created));
    }

    @GetMapping("/driver/{driverId}")
    @Operation(summary = "Get all notifications for a delivery driver")
    public ResponseEntity<ApiSuccess<List<DeliveryDriverNotificationResponse>>> getByDriverId(
            @PathVariable Integer driverId) {
        List<DeliveryDriverNotificationResponse> notifications = notificationService.getByDeliveryDriverId(driverId);
        ApiSuccess<List<DeliveryDriverNotificationResponse>> response = new ApiSuccess<>(
                notifications.isEmpty() ? "No notifications found" : "Notifications retrieved successfully",
                notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/driver/{driverId}/unread")
    @Operation(summary = "Get unread notifications for a delivery driver")
    public ResponseEntity<ApiSuccess<List<DeliveryDriverNotificationResponse>>> getUnreadByDriverId(
            @PathVariable Integer driverId) {
        List<DeliveryDriverNotificationResponse> notifications = notificationService.getUnreadByDeliveryDriverId(driverId);
        ApiSuccess<List<DeliveryDriverNotificationResponse>> response = new ApiSuccess<>(
                notifications.isEmpty() ? "No unread notifications" : "Unread notifications retrieved successfully",
                notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get notifications related to a specific order")
    public ResponseEntity<ApiSuccess<List<DeliveryDriverNotificationResponse>>> getByOrderId(
            @PathVariable Integer orderId) {
        List<DeliveryDriverNotificationResponse> notifications = notificationService.getByOrderId(orderId);
        ApiSuccess<List<DeliveryDriverNotificationResponse>> response = new ApiSuccess<>(
                notifications.isEmpty() ? "No notifications found for this order" : "Notifications retrieved successfully",
                notifications);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiSuccess<DeliveryDriverNotificationResponse>> markAsRead(
            @PathVariable Integer notificationId) {
        DeliveryDriverNotificationResponse updated = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(new ApiSuccess<>("Notification marked as read", updated));
    }

    @PatchMapping("/driver/{driverId}/read-all")
    @Operation(summary = "Mark all notifications as read for a delivery driver")
    public ResponseEntity<ApiSuccess<Void>> markAllAsRead(@PathVariable Integer driverId) {
        notificationService.markAllAsReadForDriver(driverId);
        return ResponseEntity.ok(new ApiSuccess<>("All notifications marked as read", null));
    }
}
