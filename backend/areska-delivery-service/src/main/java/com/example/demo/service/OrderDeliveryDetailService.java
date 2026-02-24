package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DeliveryStatusUpdate;
import com.example.demo.dto.NewOrderNotification;
import com.example.demo.dto.OrderDeliveryDetailRequest;
import com.example.demo.dto.OrderDeliveryDetailResponse;
import com.example.demo.dto.OrderDeliveryDetailUpdateRequest;
import com.example.demo.dto.OrderStatusUpdate;
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
    private final SimpMessagingTemplate messagingTemplate;

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

        // Broadcast a todos los drivers disponibles via WebSocket
        broadcastNewOrder(saved);

        return toResponse(saved);
    }

    /**
     * Notifica a todos los drivers disponibles de una nueva orden pendiente.
     * Publica en /topic/orders/available
     */
    public void broadcastNewOrder(OrderDeliveryDetail detail) {
        NewOrderNotification notification = new NewOrderNotification(
            detail.getId(),
            detail.getOrderId(),
            detail.getCustomerName(),
            detail.getCustomerPhone(),
            detail.getDestinationAddress(),
            detail.getDestinationLat(),
            detail.getDestinationLng(),
            detail.getCustomerNotes(),
            detail.getCreatedAt()
        );
        messagingTemplate.convertAndSend("/topic/orders/available", notification);
        log.info("Broadcasted new order {} to all available drivers", detail.getOrderId());
    }

    /**
     * El driver acepta una orden. Primer driver en llamar este método la obtiene.
     * Control de raza: verifica que siga en PENDING_ASSIGNMENT dentro de la transacción.
     */
    @Transactional
    public OrderDeliveryDetailResponse acceptOrder(Integer deliveryId, Integer driverId) {
        OrderDeliveryDetail detail = repository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with ID: " + deliveryId));

        // Control de raza: si ya fue tomada por otro driver, lanzar excepción
        if (!DeliveryStatus.PENDING_ASSIGNMENT.getValue().equals(detail.getStatus())) {
            throw new IllegalStateException("Order already taken by another driver");
        }

        DeliveryDriver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + driverId));

        detail.setDeliveryDriver(driver);
        detail.setStatus(DeliveryStatus.ACCEPTED.getValue());
        detail.setAssignedAt(LocalDateTime.now());
        detail.setAcceptedAt(LocalDateTime.now());
        repository.save(detail);

        // Bloquear al driver para no recibir más órdenes mientras esté en ruta
        driver.setIsAvailable(false);
        driverRepository.save(driver);

        // Notificar a todos que esta orden ya fue tomada → los demás drivers descartan el popup
        messagingTemplate.convertAndSend("/topic/orders/taken/" + deliveryId, driverId);
        log.info("Driver {} ({}) accepted order/delivery {}", driverId, driver.getFullName(), deliveryId);

        return toResponse(detail);
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
                // Bloquear driver al asignarlo
                if (detail.getDeliveryDriver() != null) {
                    detail.getDeliveryDriver().setIsAvailable(false);
                    driverRepository.save(detail.getDeliveryDriver());
                }
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
                // Liberar driver al completar la entrega
                if (detail.getDeliveryDriver() != null) {
                    detail.getDeliveryDriver().setIsAvailable(true);
                    driverRepository.save(detail.getDeliveryDriver());
                    log.info("Driver {} freed after delivery DELIVERED for order {}", detail.getDeliveryDriver().getId(), detail.getOrderId());
                }
                break;
            case CANCELLED:
                if (detail.getCancelledAt() == null) detail.setCancelledAt(now);
                if (cancellationReason != null) detail.setCancellationReason(cancellationReason);
                // Liberar driver si se cancela
                if (detail.getDeliveryDriver() != null) {
                    detail.getDeliveryDriver().setIsAvailable(true);
                    driverRepository.save(detail.getDeliveryDriver());
                    log.info("Driver {} freed after delivery CANCELLED for order {}", detail.getDeliveryDriver().getId(), detail.getOrderId());
                }
                break;
            default:
                break;
        }

        // Notificar al cliente sobre el cambio de estado vía WebSocket
        publishTrackingUpdate(detail, newStatus);
    }

    private void publishTrackingUpdate(OrderDeliveryDetail detail, DeliveryStatus newStatus) {
        String message = switch (newStatus) {
            case ASSIGNED         -> "Tu pedido fue asignado a un repartidor.";
            case ACCEPTED         -> "El repartidor aceptó tu pedido y se está preparando.";
            case PICKED_UP        -> "El repartidor ya recogió tu pedido.";
            case OUT_FOR_DELIVERY -> "Tu pedido está en camino hacia ti.";
            case ARRIVED          -> "El repartidor llegó a tu dirección.";
            case DELIVERED        -> "¡Tu pedido fue entregado! Gracias por tu compra.";
            case CANCELLED        -> "Tu pedido fue cancelado.";
            default               -> "El estado de tu entrega fue actualizado.";
        };

        String label = switch (newStatus) {
            case ASSIGNED         -> "Asignado";
            case ACCEPTED         -> "Aceptado";
            case PICKED_UP        -> "Recogido";
            case OUT_FOR_DELIVERY -> "En camino";
            case ARRIVED          -> "Llegó";
            case DELIVERED        -> "Entregado";
            case CANCELLED        -> "Cancelado";
            default               -> newStatus.getValue();
        };

        DeliveryDriver driver = detail.getDeliveryDriver();
        DeliveryStatusUpdate payload = new DeliveryStatusUpdate(
                detail.getId(),
                detail.getOrderId(),
                newStatus.getValue(),
                label,
                message,
                driver != null ? driver.getFullName() : null,
                driver != null ? driver.getPhone() : null,
                driver != null ? driver.getPhotoUrl() : null,
                driver != null ? driver.getCurrentLat() : null,
                driver != null ? driver.getCurrentLng() : null,
                LocalDateTime.now()
        );

        String topic = "/topic/order/" + detail.getOrderId() + "/tracking";
        messagingTemplate.convertAndSend(topic, payload);
        log.info("Published tracking update for order {} → {} to {}", detail.getOrderId(), newStatus.getValue(), topic);
        // Publicar también actualización de orden en estados terminales
        if (newStatus == DeliveryStatus.DELIVERED || newStatus == DeliveryStatus.CANCELLED) {
            String orderStatus      = newStatus == DeliveryStatus.DELIVERED ? "completed" : "cancelled";
            String orderStatusLabel = newStatus == DeliveryStatus.DELIVERED ? "Completado" : "Cancelado";
            String orderMessage     = newStatus == DeliveryStatus.DELIVERED
                    ? "¡Tu pedido fue entregado exitosamente!"
                    : "Tu pedido fue cancelado.";
            OrderStatusUpdate orderPayload = new OrderStatusUpdate(
                    detail.getOrderId(), orderStatus, orderStatusLabel, orderMessage, LocalDateTime.now());
            String orderTopic = "/topic/order/" + detail.getOrderId() + "/status";
            messagingTemplate.convertAndSend(orderTopic, orderPayload);
            log.info("Published order status update for order {} \u2192 {} to {}", detail.getOrderId(), orderStatus, orderTopic);
        }    }

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
