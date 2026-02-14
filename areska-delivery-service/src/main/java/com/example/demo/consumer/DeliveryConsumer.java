package com.example.demo.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.demo.dto.DeliveryRequest;
import com.example.demo.service.DeliveryService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryConsumer {

    private final DeliveryService deliveryService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${delivery.queue.name:delivery.orders.queue}")
    public void receiveDeliveryRequest(String message) {
        try {
            log.info("Received delivery request: {}", message);
            DeliveryRequest request = objectMapper.readValue(message, DeliveryRequest.class);
            deliveryService.create(request);
            log.info("Successfully processed delivery request for order ID: {}", request.orderId());
        } catch (Exception e) {
            log.error("Error processing delivery request: {}", e.getMessage(), e);
            // En un escenario real, podrías enviar el mensaje a una cola de dead-letter
            // o implementar un mecanismo de reintento
        }
    }
}
