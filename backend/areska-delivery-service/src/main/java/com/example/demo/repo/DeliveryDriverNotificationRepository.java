package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.DeliveryDriverNotification;

import java.util.List;

public interface DeliveryDriverNotificationRepository extends JpaRepository<DeliveryDriverNotification, Integer> {
    List<DeliveryDriverNotification> findByDeliveryDriverIdOrderByCreatedAtDesc(Integer deliveryDriverId);
    List<DeliveryDriverNotification> findByDeliveryDriverIdAndIsReadFalseOrderByCreatedAtDesc(Integer deliveryDriverId);
    List<DeliveryDriverNotification> findByRelatedOrderId(Integer relatedOrderId);
}
