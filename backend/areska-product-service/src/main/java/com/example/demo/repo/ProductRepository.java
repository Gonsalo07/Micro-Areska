package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    List<Product> findByCategoryId(Integer categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findAvailableProducts();
    
    Optional<Product> findById(Integer id);
}
