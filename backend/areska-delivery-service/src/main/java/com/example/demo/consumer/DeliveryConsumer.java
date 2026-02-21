package com.example.demo.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.demo.dto.DeliveryRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Este consumer ha sido deshabilitado porque el modelo de delivery cambió.
 * Ahora los delivery drivers se asignan directamente a las órdenes en la tabla orders.
 * Si necesitas procesar asignaciones de delivery, considera actualizar este consumer
 * para trabajar con el nuevo modelo DeliveryDriver.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryConsumer {

    private final ObjectMapper objectMapper;

    // @RabbitListener(queues = "${delivery.queue.name:delivery.orders.queue}")
    public void receiveDeliveryRequest(String message) {
        try {
            log.info("Received delivery request: {}", message);
            DeliveryRequest request = objectMapper.readValue(message, DeliveryRequest.class);
            // TODO: Implementar lógica para asignar un delivery driver disponible a la orden
            log.info("Delivery request received for order ID: {}", request.orderId());
        } catch (Exception e) {
            log.error("Error processing delivery request: {}", e.getMessage(), e);
        }
    }
}
