package com.example.demo.controller;

import com.example.demo.dto.DeliveryLocationUpdate;
import com.example.demo.service.DeliveryTrackingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 * WebSocket controller for real-time delivery tracking
 * Handles location updates from delivery drivers
 */

@Controller
@RequiredArgsConstructor
@Slf4j
public class DeliveryTrackingController {
    
    private final DeliveryTrackingService trackingService;
    
    /**
     * Endpoint: /app/delivery/location
     * Delivery driver sends location updates
     * Broadcasts to: /topic/order/{orderId}/location
     */
    @MessageMapping("/delivery/location")
    public void updateLocation(@Payload DeliveryLocationUpdate locationUpdate) {
        log.info("📍 Location update received - Delivery ID: {}, Order ID: {}, Lat: {}, Lng: {}", 
                locationUpdate.getDeliveryId(),
                locationUpdate.getOrderId(),
                locationUpdate.getLatitude(),
                locationUpdate.getLongitude());
        
        // Validate and broadcast
        trackingService.updateAndBroadcastLocation(locationUpdate);
    }
}
