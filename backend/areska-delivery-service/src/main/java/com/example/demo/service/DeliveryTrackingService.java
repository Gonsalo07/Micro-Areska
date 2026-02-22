package com.example.demo.service;

import com.example.demo.dto.DeliveryLocationUpdate;
import com.example.demo.dto.OrderDeliveryDetailResponse;
import com.example.demo.model.DeliveryDriver;
import com.example.demo.model.OrderDeliveryDetail;
import com.example.demo.repo.DeliveryDriverRepository;
import com.example.demo.repo.OrderDeliveryDetailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Service for handling real-time delivery tracking via WebSocket
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DeliveryTrackingService {
    
    private final DeliveryDriverRepository driverRepository;
    private final OrderDeliveryDetailRepository deliveryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Update driver location and broadcast to all clients tracking this delivery
     */
    @Transactional
    public void updateAndBroadcastLocation(DeliveryLocationUpdate locationUpdate) {
        try {
            // 1. Find the delivery
            OrderDeliveryDetail delivery = deliveryRepository.findById(locationUpdate.getDeliveryId())
                    .orElseThrow(() -> new RuntimeException("Delivery not found"));
            
            // 2. Update driver's current location
            DeliveryDriver driver = delivery.getDeliveryDriver();
            if (driver == null) {
                log.warn("⚠️ No driver assigned to delivery {}", locationUpdate.getDeliveryId());
                return;
            }
            
            driver.setCurrentLat(BigDecimal.valueOf(locationUpdate.getLatitude()));
            driver.setCurrentLng(BigDecimal.valueOf(locationUpdate.getLongitude()));
            driverRepository.save(driver);
            
            log.info("✅ Updated driver {} location: ({}, {})", 
                    driver.getId(), 
                    locationUpdate.getLatitude(), 
                    locationUpdate.getLongitude());
            
            // 3. Prepare location update message
            DeliveryLocationUpdate broadcastMessage = DeliveryLocationUpdate.builder()
                    .deliveryId(delivery.getId())
                    .orderId(delivery.getOrderId())
                    .latitude(locationUpdate.getLatitude())
                    .longitude(locationUpdate.getLongitude())
                    .timestamp(System.currentTimeMillis())
                    .driverName(driver.getFullName())
                    .estimatedDistance(locationUpdate.getEstimatedDistance())
                    .estimatedDuration(locationUpdate.getEstimatedDuration())
                    .build();
            
            // 4. Broadcast to all clients subscribed to this delivery
            String topic = "/topic/delivery/" + delivery.getId();
            messagingTemplate.convertAndSend(topic, broadcastMessage);
            
            log.info("📡 Broadcasted location update to topic: {}", topic);
            
            // 5. Also broadcast to order topic (for clients subscribed by orderId)
            String orderTopic = "/topic/order/" + delivery.getOrderId() + "/location";
            messagingTemplate.convertAndSend(orderTopic, broadcastMessage);
            
            log.info("📡 Broadcasted location update to topic: {}", orderTopic);
            
        } catch (Exception e) {
            log.error("❌ Error updating/broadcasting location: {}", e.getMessage(), e);
        }
    }
}
