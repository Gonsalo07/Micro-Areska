package com.example.demo.repo;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.Order;

public interface OrderRepository extends CrudRepository<Order, Integer> { 
    List<Order> findByUserId(Integer userId);
}