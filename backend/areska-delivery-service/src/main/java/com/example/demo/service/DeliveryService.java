package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DeliveryRequest;
import com.example.demo.dto.DeliveryResponse;
import com.example.demo.dto.DeliveryUpdateRequest;
import com.example.demo.model.Delivery;
import com.example.demo.repo.DeliveryRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    @Transactional
    public DeliveryResponse create(DeliveryRequest request) {
        Delivery delivery = Delivery.builder()
                .orderId(request.orderId())
                .userId(request.userId())
                .deliveryAddress(request.deliveryAddress())
                .notes(request.notes())
                .status("pending")
                .build();

        Delivery saved = deliveryRepository.save(delivery);
        log.info("Delivery created for order ID: {}", request.orderId());
        return toResponse(saved);
    }

    public List<DeliveryResponse> getAll() {
        return deliveryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public DeliveryResponse getById(Integer id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + id));
        return toResponse(delivery);
    }

    public List<DeliveryResponse> getByOrderId(Integer orderId) {
        List<Delivery> deliveries = deliveryRepository.findByOrderId(orderId);
        return deliveries.stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryResponse> getByUserId(Integer userId) {
        List<Delivery> deliveries = deliveryRepository.findByUserId(userId);
        return deliveries.stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryResponse> getByStatus(String status) {
        List<Delivery> deliveries = deliveryRepository.findByStatus(status);
        return deliveries.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DeliveryResponse update(Integer id, DeliveryUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + id));

        if (request.status() != null && !request.status().isBlank()) {
            delivery.setStatus(request.status());
        }

        if (request.notes() != null) {
            delivery.setNotes(request.notes());
        }

        Delivery updated = deliveryRepository.save(delivery);
        log.info("Delivery updated for ID: {}, new status: {}", id, updated.getStatus());
        return toResponse(updated);
    }

    @Transactional
    public void delete(Integer id) {
        if (!deliveryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Delivery not found with ID: " + id);
        }
        deliveryRepository.deleteById(id);
        log.info("Delivery deleted with ID: {}", id);
    }

    private DeliveryResponse toResponse(Delivery delivery) {
        return new DeliveryResponse(
                delivery.getId(),
                delivery.getOrderId(),
                delivery.getUserId(),
                delivery.getDeliveryAddress(),
                delivery.getNotes(),
                delivery.getStatus(),
                delivery.getCreatedAt(),
                delivery.getUpdatedAt());
    }
}
