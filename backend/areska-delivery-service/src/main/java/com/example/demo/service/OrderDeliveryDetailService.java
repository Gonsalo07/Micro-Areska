package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.OrderDeliveryDetailRequest;
import com.example.demo.dto.OrderDeliveryDetailResponse;
import com.example.demo.dto.OrderDeliveryDetailUpdateRequest;
import com.example.demo.model.DeliveryDriver;
import com.example.demo.model.DeliveryStatus;
import com.example.demo.model.OrderDeliveryDetail;
import com.example.demo.repo.DeliveryDriverRepository;
import com.example.demo.repo.OrderDeliveryDetailRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderDeliveryDetailService {

    private final OrderDeliveryDetailRepository repository;
    private final DeliveryDriverRepository driverRepository;

    public List<OrderDeliveryDetailResponse> getAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderDeliveryDetailResponse getById(Integer id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Order delivery detail not found with ID: " + id));
    }

    public OrderDeliveryDetailResponse getByOrderId(Integer orderId) {
        return repository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Order delivery detail not found for order ID: " + orderId));
    }

    public List<OrderDeliveryDetailResponse> getByDriverId(Integer driverId) {
        return repository.findByDeliveryDriver_Id(driverId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderDeliveryDetailResponse> getActiveByDriverId(Integer driverId) {
        List<String> activeStatuses = List.of(
            DeliveryStatus.ASSIGNED.getValue(),
            DeliveryStatus.ACCEPTED.getValue(),
            DeliveryStatus.PICKED_UP.getValue(),
            DeliveryStatus.OUT_FOR_DELIVERY.getValue(),
            DeliveryStatus.ARRIVED.getValue()
        );
        return repository.findByDriverIdAndStatusIn(driverId, activeStatuses).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderDeliveryDetailResponse> getPendingAssignment() {
        return repository.findPendingAssignment().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderDeliveryDetailResponse> getByStatus(String status) {
        return repository.findByStatus(status).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderDeliveryDetailResponse create(OrderDeliveryDetailRequest request) {
        if (repository.existsByOrderId(request.getOrderId())) {
            throw new IllegalArgumentException("Delivery detail already exists for order ID: " + request.getOrderId());
        }

        OrderDeliveryDetail detail = OrderDeliveryDetail.builder()
                .orderId(request.getOrderId())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .destinationAddress(request.getDestinationAddress())
                .destinationLat(request.getDestinationLat())
                .destinationLng(request.getDestinationLng())
                .destinationReference(request.getDestinationReference())
                .customerNotes(request.getCustomerNotes())
                .status(DeliveryStatus.PENDING_ASSIGNMENT.getValue())
                .build();

        OrderDeliveryDetail saved = repository.save(detail);
        log.info("Created delivery detail for order ID: {} (Customer: {})", request.getOrderId(), request.getCustomerName());
        return toResponse(saved);
    }

    @Transactional
    public OrderDeliveryDetailResponse update(Integer id, OrderDeliveryDetailUpdateRequest request) {
        OrderDeliveryDetail detail = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order delivery detail not found with ID: " + id));

        // Asignar driver
        if (request.getDeliveryDriverId() != null) {
            DeliveryDriver driver = driverRepository.findById(request.getDeliveryDriverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + request.getDeliveryDriverId()));
            detail.setDeliveryDriver(driver);
        }

        // Actualizar estado con timestamps
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            updateStatus(detail, request.getStatus(), request.getCancellationReason());
        }

        // Notas del driver
        if (request.getDriverNotes() != null) {
            detail.setDriverNotes(request.getDriverNotes());
        }

        OrderDeliveryDetail saved = repository.save(detail);
        log.info("Updated delivery detail ID: {} to status: {}", id, saved.getStatus());
        return toResponse(saved);
    }

    @Transactional
    public OrderDeliveryDetailResponse assignDriver(Integer id, Integer driverId) {
        OrderDeliveryDetail detail = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order delivery detail not found with ID: " + id));

        DeliveryDriver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + driverId));

        detail.setDeliveryDriver(driver);
        detail.setStatus(DeliveryStatus.ASSIGNED.getValue());
        detail.setAssignedAt(LocalDateTime.now());

        OrderDeliveryDetail saved = repository.save(detail);
        log.info("Assigned driver {} to delivery detail {}", driverId, id);
        return toResponse(saved);
    }

    @Transactional
    public OrderDeliveryDetailResponse updateStatusByOrderId(Integer orderId, String status, String cancellationReason) {
        OrderDeliveryDetail detail = repository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order delivery detail not found for order ID: " + orderId));

        updateStatus(detail, status, cancellationReason);
        
        OrderDeliveryDetail saved = repository.save(detail);
        log.info("Updated delivery status for order {} to {}", orderId, status);
        return toResponse(saved);
    }

    private void updateStatus(OrderDeliveryDetail detail, String statusValue, String cancellationReason) {
        DeliveryStatus newStatus;
        try {
            newStatus = DeliveryStatus.fromValue(statusValue);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid delivery status: " + statusValue + 
                ". Valid values: PENDING_ASSIGNMENT, ASSIGNED, ACCEPTED, PICKED_UP, OUT_FOR_DELIVERY, ARRIVED, DELIVERED, CANCELLED");
        }

        detail.setStatus(newStatus.getValue());
        LocalDateTime now = LocalDateTime.now();

        switch (newStatus) {
            case ASSIGNED:
                if (detail.getAssignedAt() == null) detail.setAssignedAt(now);
                break;
            case ACCEPTED:
                if (detail.getAcceptedAt() == null) detail.setAcceptedAt(now);
                break;
            case PICKED_UP:
                if (detail.getPickedUpAt() == null) detail.setPickedUpAt(now);
                break;
            case OUT_FOR_DELIVERY:
                if (detail.getOutForDeliveryAt() == null) detail.setOutForDeliveryAt(now);
                break;
            case ARRIVED:
                if (detail.getArrivedAt() == null) detail.setArrivedAt(now);
                break;
            case DELIVERED:
                if (detail.getDeliveredAt() == null) detail.setDeliveredAt(now);
                break;
            case CANCELLED:
                if (detail.getCancelledAt() == null) detail.setCancelledAt(now);
                if (cancellationReason != null) detail.setCancellationReason(cancellationReason);
                break;
            default:
                break;
        }
    }

    private OrderDeliveryDetailResponse toResponse(OrderDeliveryDetail d) {
        DeliveryDriver driver = d.getDeliveryDriver();
        
        return new OrderDeliveryDetailResponse(
                d.getId(),
                d.getOrderId(),
                driver != null ? driver.getId() : null,
                driver != null ? driver.getFullName() : null,
                driver != null ? driver.getPhone() : null,
                driver != null ? driver.getPhotoUrl() : null,
                driver != null ? driver.getCurrentLat() : null,
                driver != null ? driver.getCurrentLng() : null,
                d.getCustomerName(),
                d.getCustomerPhone(),
                d.getDestinationAddress(),
                d.getDestinationLat(),
                d.getDestinationLng(),
                d.getDestinationReference(),
                d.getCustomerNotes(),
                d.getDriverNotes(),
                d.getStatus(),
                d.getAssignedAt(),
                d.getAcceptedAt(),
                d.getPickedUpAt(),
                d.getOutForDeliveryAt(),
                d.getArrivedAt(),
                d.getDeliveredAt(),
                d.getCancelledAt(),
                d.getCancellationReason(),
                d.getCreatedAt(),
                d.getUpdatedAt()
        );
    }
}
