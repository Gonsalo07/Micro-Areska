package com.example.demo.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.dto.CategoryResponse;
import com.example.demo.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findById(Integer id);
    
    @Query("""
        SELECT new com.example.demo.dto.CategoryResponse(
            c.id,
            c.name,
            c.slug,
            c.description,
            c.createdAt
        )
        FROM Category c
        ORDER BY c.id DESC
    """)
    List<CategoryResponse> findList();

    @Query("""
        SELECT new com.example.demo.dto.CategoryResponse(
            c.id,
            c.name,
            c.slug,
            c.description,
            c.createdAt
        )
        FROM Category c
        WHERE c.id = :id
    """)
    Optional<CategoryResponse> findDetailById(Integer id);
}
