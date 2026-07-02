package com.example.demo.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.client.ProductFeignCliente.ProductResponse;
import com.example.demo.client.ProductFeignCliente.StockUpdateRequest;
import com.example.demo.shared.exception.ResourceNotFoundException;

import java.util.Optional;

@Component
public class ProductServiceClient {

    @Autowired
    private ProductFeignCliente productFeignClient;

    public Optional<ProductResponse> findProductById(Integer id) {
        try {
            var response = productFeignClient.getProductById(id);
            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void updateProductStock(Integer productId, Integer newStock) {
        try {
            productFeignClient.updateProductStock(productId, new StockUpdateRequest(newStock));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product stock for product ID: " + productId, e);
        }
    }
}

