package com.example.demo.repo;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.OrderDetails;



public interface OrderDetailsRepository extends CrudRepository<OrderDetails, Integer> {
    List<OrderDetails> findByOrder_Id(Integer orderId);
}

