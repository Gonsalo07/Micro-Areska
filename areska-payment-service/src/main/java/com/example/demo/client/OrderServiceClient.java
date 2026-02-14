package com.example.demo.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.client.OrderFeignClient.OrderResponse;
import com.example.demo.shared.exception.ResourceNotFoundException;

import java.util.Optional;

@Component
public class OrderServiceClient {

    @Autowired
    private OrderFeignClient orderFeignClient;

    public Optional<OrderResponse> findOrderById(Integer id) {
        try {
            var response = orderFeignClient.getOrderById(id);
            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
            return Optional.empty();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Order not found with ID: " + id);
        }
    }
}
