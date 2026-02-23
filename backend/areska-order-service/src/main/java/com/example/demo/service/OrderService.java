package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.client.ProductServiceClient;
import com.example.demo.client.UserServiceClient;
import com.example.demo.dto.DeliveryRequest;
import com.example.demo.dto.request.OrderCreateRequest;
import com.example.demo.dto.request.OrderUpdateRequest;
import com.example.demo.dto.response.OrderDetailReponse;
import com.example.demo.dto.response.OrderResponse;
import com.example.demo.dto.response.OrderStatusUpdate;
import com.example.demo.model.Order;
import com.example.demo.model.OrderDetails;
import com.example.demo.model.OrderStatus;
import com.example.demo.producer.DeliveryProducer;
import com.example.demo.repo.OrderDetailsRepository;
import com.example.demo.repo.OrderRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio de órdenes
 * 
 * Estados de orden (status):
 *   - pending    : Pedido recién creado
 *   - confirmed  : Pedido confirmado
 *   - preparing  : En preparación
 *   - ready      : Listo para entrega/recogida
 *   - completed  : Completado
 *   - cancelled  : Cancelado
 * 
 * Nota: Los estados de entrega se manejan en delivery-service (order_delivery_details)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailsRepository orderDetailRepository;
    private final UserServiceClient userServiceClient;
    private final ProductServiceClient productServiceClient;
    private final DeliveryProducer deliveryProducer;
    private final SimpMessagingTemplate messagingTemplate;

    public List<OrderResponse> getList() {
        return StreamSupport.stream(orderRepository.findAll().spliterator(), false)
                .map(order -> toResponse(order))
                .toList();
    }

    public List<OrderResponse> getOrdersByUserId(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        if (orders.isEmpty()) {
            throw new ResourceNotFoundException("No orders found for user ID: " + userId);
        }
        return orders.stream()
                .map(order -> toResponse(order))
                .toList();
    }

    public List<OrderResponse> getOrdersByFirebaseUid(String firebaseUid) {
        // Obtener el usuario por firebaseUid
        var user = userServiceClient.findUserByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with firebaseUid: " + firebaseUid));
        
        // Buscar órdenes por userId
        List<Order> orders = orderRepository.findByUserId(user.id());
        return orders.stream()
                .map(order -> toResponse(order))
                .toList();
    }

    public OrderResponse getDetailById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        return toResponse(order);
    }

    @Transactional
    public OrderResponse create(OrderCreateRequest req) {
        // Validar que el usuario existe usando Feign
        var user = userServiceClient.findUserById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + req.getUserId()));

        Order order = Order.builder()
                .userId(req.getUserId())
                .status("pending")
                .pickupMethod(req.getPickupMethod() == null ? "store" : req.getPickupMethod())
                .total(BigDecimal.ZERO)
                .deliveryAddress(req.getDeliveryAddress())
                .destinationLat(req.getDestinationLat())
                .destinationLng(req.getDestinationLng())
                .customerNotes(req.getCustomerNotes())
                .build();

        Order savedOrder = orderRepository.save(order);

        if (req.getItems() != null && !req.getItems().isEmpty()) {
            List<OrderDetails> details = req.getItems().stream().map(it -> {
                if (it.getQuantity() == null || it.getQuantity() <= 0)
                    throw new IllegalArgumentException("Quantity must be >= 1 for productId=" + it.getProductId());

                // Obtener producto usando Feign
                var productResponse = productServiceClient.findProductById(it.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + it.getProductId()));

                if (productResponse.stock() != null && productResponse.stock() < it.getQuantity())
                    throw new IllegalArgumentException("Not enough stock for product " + it.getProductId());

                // Actualizar stock usando Feign
                if (productResponse.stock() != null) {
                    int newStock = productResponse.stock() - it.getQuantity();
                    productServiceClient.updateProductStock(it.getProductId(), newStock);
                }

                return OrderDetails.builder()
                        .order(savedOrder)
                        .productId(it.getProductId())
                        .quantity(it.getQuantity())
                        .unitPrice(productResponse.price())
                        .build();
            }).toList();

            orderDetailRepository.saveAll(details);

            BigDecimal total = details.stream()
                    .map(d -> d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            savedOrder.setTotal(total);
            orderRepository.save(savedOrder);

            // Enviar a la cola de delivery si el método de entrega es "delivery"
            if ("delivery".equalsIgnoreCase(req.getPickupMethod()) && req.getDeliveryAddress() != null) {
                try {
                    String customerName = (user.firstName() != null ? user.firstName() : "") + 
                                         (user.lastName() != null ? " " + user.lastName() : "");
                    customerName = customerName.trim().isEmpty() ? "Cliente" : customerName.trim();
                    
                    DeliveryRequest deliveryRequest = new DeliveryRequest(
                            savedOrder.getId(),
                            req.getUserId(),
                            customerName,
                            user.phone(),
                            req.getDeliveryAddress(),
                            req.getDestinationLat(),
                            req.getDestinationLng(),
                            req.getCustomerNotes()
                    );
                    deliveryProducer.sendDeliveryRequest(deliveryRequest);
                    log.info("Delivery request sent to queue for order ID: {} (Customer: {})", 
                            savedOrder.getId(), customerName);
                } catch (Exception e) {
                    log.error("Failed to send delivery request to queue: {}", e.getMessage());
                    // No lanzamos excepción para que la orden se cree igual
                }
            }

            return toResponse(savedOrder, details);
        }

        return toResponse(savedOrder);
    }

    @Transactional
    public OrderResponse update(Integer id, OrderUpdateRequest req) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        // Validar y actualizar status usando el enum
        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            try {
                OrderStatus.fromValue(req.getStatus()); // Valida que sea un estado válido
                order.setStatus(req.getStatus());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid order status: " + req.getStatus() + 
                    ". Valid values: pending, confirmed, preparing, ready, completed, cancelled");
            }
        }
        
        OrderResponse saved = toResponse(orderRepository.save(order));

        // Notificar al cliente vía WebSocket
        if (req.getStatus() != null && !req.getStatus().isBlank()) {
            publishOrderStatusUpdate(saved.id(), saved.status());
        }

        return saved;
    }

    private void publishOrderStatusUpdate(Integer orderId, String statusValue) {
        String label = switch (statusValue.toLowerCase()) {
            case "pending"   -> "Pendiente";
            case "confirmed" -> "Confirmado";
            case "preparing" -> "En preparación";
            case "ready"     -> "Listo";
            case "completed" -> "Completado";
            case "cancelled" -> "Cancelado";
            default          -> statusValue;
        };

        String message = switch (statusValue.toLowerCase()) {
            case "pending"   -> "Tu pedido fue recibido y está pendiente de confirmación.";
            case "confirmed" -> "Tu pedido fue confirmado.";
            case "preparing" -> "Tu pedido está siendo preparado.";
            case "ready"     -> "Tu pedido está listo.";
            case "completed" -> "¡Tu pedido fue completado!";
            case "cancelled" -> "Tu pedido fue cancelado.";
            default          -> "El estado de tu pedido fue actualizado.";
        };

        OrderStatusUpdate payload = new OrderStatusUpdate(orderId, statusValue, label, message, LocalDateTime.now());
        String topic = "/topic/order/" + orderId + "/status";
        messagingTemplate.convertAndSend(topic, payload);
        log.info("Published order status update for order {} → {} to {}", orderId, statusValue, topic);
    }

    private OrderResponse toResponse(Order o) {
        List<OrderDetails> details = orderDetailRepository.findByOrder_Id(o.getId());
        return toResponse(o, details);
    }

    private OrderResponse toResponse(Order o, List<OrderDetails> details) {
        List<OrderDetailReponse> items = details.stream().map(d -> {
            // Obtener información del producto usando Feign
            var product = productServiceClient.findProductById(d.getProductId())
                    .orElse(null);
            
            String productName = product != null ? product.name() : "Unknown Product";
            
            return new OrderDetailReponse(
                    d.getId(),
                    o.getId(),
                    d.getProductId(),
                    productName,
                    d.getQuantity(),
                    d.getUnitPrice(),
                    d.getUnitPrice().multiply(BigDecimal.valueOf(d.getQuantity())));
        }).toList();

        return new OrderResponse(
                o.getId(),
                o.getUserId(),
                o.getOrderDate(),
                o.getStatus(),
                o.getTotal(),
                o.getPickupMethod(),
                o.getUpdatedAt(),
                items);
    }
}
