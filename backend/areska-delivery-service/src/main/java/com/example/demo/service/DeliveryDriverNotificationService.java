package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DeliveryDriverNotificationRequest;
import com.example.demo.dto.DeliveryDriverNotificationResponse;
import com.example.demo.model.DeliveryDriverNotification;
import com.example.demo.repo.DeliveryDriverNotificationRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DeliveryDriverNotificationService {

    private final DeliveryDriverNotificationRepository notificationRepository;

    @Transactional
    public DeliveryDriverNotificationResponse create(DeliveryDriverNotificationRequest request) {
        DeliveryDriverNotification notification = DeliveryDriverNotification.builder()
                .deliveryDriverId(request.deliveryDriverId())
                .title(request.title())
                .message(request.message())
                .type(request.type())
                .relatedOrderId(request.relatedOrderId())
                .isRead(false)
                .build();

        DeliveryDriverNotification saved = notificationRepository.save(notification);
        log.info("Notification created for delivery driver ID: {}", request.deliveryDriverId());
        return toResponse(saved);
    }

    public List<DeliveryDriverNotificationResponse> getByDeliveryDriverId(Integer deliveryDriverId) {
        return notificationRepository.findByDeliveryDriverIdOrderByCreatedAtDesc(deliveryDriverId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryDriverNotificationResponse> getUnreadByDeliveryDriverId(Integer deliveryDriverId) {
        return notificationRepository.findByDeliveryDriverIdAndIsReadFalseOrderByCreatedAtDesc(deliveryDriverId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryDriverNotificationResponse> getByOrderId(Integer orderId) {
        return notificationRepository.findByRelatedOrderId(orderId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DeliveryDriverNotificationResponse markAsRead(Integer notificationId) {
        DeliveryDriverNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));
        
        notification.setIsRead(true);
        DeliveryDriverNotification updated = notificationRepository.save(notification);
        log.info("Notification marked as read: {}", notificationId);
        return toResponse(updated);
    }

    @Transactional
    public void markAllAsReadForDriver(Integer deliveryDriverId) {
        List<DeliveryDriverNotification> notifications = 
            notificationRepository.findByDeliveryDriverIdAndIsReadFalseOrderByCreatedAtDesc(deliveryDriverId);
        
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
        log.info("All notifications marked as read for driver ID: {}", deliveryDriverId);
    }

    private DeliveryDriverNotificationResponse toResponse(DeliveryDriverNotification notification) {
        return new DeliveryDriverNotificationResponse(
                notification.getId(),
                notification.getDeliveryDriverId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getRelatedOrderId(),
                notification.getIsRead(),
                notification.getCreatedAt());
    }
}
