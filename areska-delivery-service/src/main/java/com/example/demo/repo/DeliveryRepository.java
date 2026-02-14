package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {
    List<Delivery> findByOrderId(Integer orderId);
    List<Delivery> findByUserId(Integer userId);
    List<Delivery> findByStatus(String status);
    Optional<Delivery> findById(Integer id);
}
