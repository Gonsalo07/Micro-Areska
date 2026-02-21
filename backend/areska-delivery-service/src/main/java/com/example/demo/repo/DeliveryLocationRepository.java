package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.DeliveryLocation;

import java.util.List;

public interface DeliveryLocationRepository extends JpaRepository<DeliveryLocation, Integer> {
    List<DeliveryLocation> findByOrderIdOrderByRecordedAtDesc(Integer orderId);
    List<DeliveryLocation> findByDeliveryDriverIdOrderByRecordedAtDesc(Integer deliveryDriverId);
}
