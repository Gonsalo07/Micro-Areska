package com.example.demo.dto.response;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({ "id", "orderId", "product", "quantity", "unitPrice", "lineTotal" })
public record OrderDetailReponse(
        Integer id,
        Integer orderId,

        @JsonIgnore Integer productId,
        @JsonIgnore String  productName,
        @JsonIgnore String  productImage,

        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal priceTotal) 
{

    @JsonGetter("product")
    public Map<String, Object> getProduct() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", productId());
        map.put("name", productName());
        if (productImage() != null && !productImage().isBlank()) {
            map.put("image", productImage());
        }
        return map;
    }
}