package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.DeliveryDriver;

public interface DeliveryDriverRepository extends JpaRepository<DeliveryDriver, Integer> {
    Optional<DeliveryDriver> findByFirebaseUid(String firebaseUid);
    Optional<DeliveryDriver> findByEmail(String email);
    List<DeliveryDriver> findByIsAvailable(Boolean isAvailable);
    List<DeliveryDriver> findByIsActive(Boolean isActive);
    List<DeliveryDriver> findByCompanyName(String companyName);
    List<DeliveryDriver> findByIsAvailableAndIsActive(Boolean isAvailable, Boolean isActive);

    /**
     * Busca drivers activos, disponibles y que NO tengan una orden en curso.
     * Una orden en curso = status en (ASSIGNED, ACCEPTED, PICKED_UP, OUT_FOR_DELIVERY, ARRIVED)
     */
    @Query("""
        SELECT d FROM DeliveryDriver d
        WHERE d.isAvailable = true
          AND d.isActive = true
          AND d.deletedAt IS NULL
          AND NOT EXISTS (
            SELECT 1 FROM OrderDeliveryDetail odd
            WHERE odd.deliveryDriver.id = d.id
              AND odd.status IN ('ASSIGNED','ACCEPTED','PICKED_UP','OUT_FOR_DELIVERY','ARRIVED')
          )
        ORDER BY d.lastLocationUpdate ASC NULLS LAST
        """)
    List<DeliveryDriver> findAvailableDriversWithoutActiveOrder();
}
