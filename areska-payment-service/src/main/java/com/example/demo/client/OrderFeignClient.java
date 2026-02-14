package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.shared.Api.ApiSuccess;

@FeignClient(name = "ARESKA-ORDER-SERVICE")
public interface OrderFeignClient {

    @GetMapping("/orders/{id}")
    ApiSuccess<OrderResponse> getOrderById(@PathVariable Integer id);

    record OrderResponse(
            Integer id,
            Integer userId,
            java.time.LocalDateTime orderDate,
            String status,
            java.math.BigDecimal total,
            String pickupMethod) {
    }
}
