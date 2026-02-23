package com.example.demo.consumer;

import java.math.BigDecimal;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.demo.dto.DeliveryRequest;
import com.example.demo.dto.OrderDeliveryDetailRequest;
import com.example.demo.service.OrderDeliveryDetailService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Consumer de RabbitMQ para procesar solicitudes de delivery.
 * Cuando order-service crea una orden con pickup_method='delivery',
 * envía un mensaje a la cola y este consumer crea el OrderDeliveryDetail.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryConsumer {

    private final ObjectMapper objectMapper;
    private final OrderDeliveryDetailService orderDeliveryDetailService;

    @RabbitListener(queues = "${delivery.queue.name:delivery.orders.queue}")
    public void receiveDeliveryRequest(String message) {
        try {
            log.info("Received delivery request: {}", message);
            DeliveryRequest request = objectMapper.readValue(message, DeliveryRequest.class);
            
            // Crear el detalle de entrega
            OrderDeliveryDetailRequest detailRequest = OrderDeliveryDetailRequest.builder()
                    .orderId(request.getOrderId())
                    .customerName(request.getCustomerName())
                    .customerPhone(request.getCustomerPhone())
                    .destinationAddress(request.getDeliveryAddress())
                    .destinationLat(request.getDestinationLat())
                    .destinationLng(request.getDestinationLng())
                    .customerNotes(request.getNotes())
                    .build();
            
            var created = orderDeliveryDetailService.create(detailRequest);
            log.info("Created delivery detail ID: {} for order ID: {} (Customer: {})", 
                    created.id(), request.getOrderId(), request.getCustomerName());
            
        } catch (Exception e) {
            log.error("Error processing delivery request: {}", e.getMessage(), e);
        }
    }
}
