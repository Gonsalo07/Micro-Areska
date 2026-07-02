package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.OrderDeliveryDetail;

@Repository
public interface OrderDeliveryDetailRepository extends JpaRepository<OrderDeliveryDetail, Integer> {

    Optional<OrderDeliveryDetail> findByOrderId(Integer orderId);

    List<OrderDeliveryDetail> findByDeliveryDriver_Id(Integer driverId);

    List<OrderDeliveryDetail> findByStatus(String status);

    List<OrderDeliveryDetail> findByDeliveryDriver_IdAndStatus(Integer driverId, String status);

    @Query("SELECT odd FROM OrderDeliveryDetail odd WHERE odd.deliveryDriver.id = :driverId AND odd.status IN :statuses")
    List<OrderDeliveryDetail> findByDriverIdAndStatusIn(@Param("driverId") Integer driverId, @Param("statuses") List<String> statuses);

    @Query("SELECT odd FROM OrderDeliveryDetail odd WHERE odd.status = 'PENDING_ASSIGNMENT'")
    List<OrderDeliveryDetail> findPendingAssignment();

    boolean existsByOrderId(Integer orderId);

    long countByDeliveryDriver_IdAndStatus(Integer driverId, String status);

    @Query("""
        SELECT odd FROM OrderDeliveryDetail odd
        WHERE odd.deliveryDriver.id = :driverId
        AND odd.status IN ('DELIVERED', 'CANCELLED')
        AND (
            :search IS NULL OR :search = '' OR
            LOWER(COALESCE(odd.customerName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(COALESCE(odd.destinationAddress, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(COALESCE(odd.customerPhone, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
            CAST(odd.orderId AS string) LIKE CONCAT('%', :search, '%')
        )
        ORDER BY COALESCE(odd.deliveredAt, odd.cancelledAt, odd.updatedAt) DESC
        """)
    Page<OrderDeliveryDetail> findDriverHistory(
        @Param("driverId") Integer driverId,
        @Param("search") String search,
        Pageable pageable
    );
}
