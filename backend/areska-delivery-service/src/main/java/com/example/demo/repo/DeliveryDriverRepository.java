package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.DeliveryDriver;

public interface DeliveryDriverRepository extends JpaRepository<DeliveryDriver, Integer> {
    Optional<DeliveryDriver> findByFirebaseUid(String firebaseUid);
    Optional<DeliveryDriver> findByEmail(String email);
    List<DeliveryDriver> findByIsAvailable(Boolean isAvailable);
    List<DeliveryDriver> findByIsActive(Boolean isActive);
    List<DeliveryDriver> findByCompanyName(String companyName);
    List<DeliveryDriver> findByIsAvailableAndIsActive(Boolean isAvailable, Boolean isActive);
}
