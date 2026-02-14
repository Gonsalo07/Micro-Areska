package com.example.demo.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.demo.dto.CategoryResponse;
import com.example.demo.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends CrudRepository<Category, Integer> {
    @Query("""
        SELECT 
            c.id AS id,
            c.name AS name,
            c.slug AS slug,
            c.description AS description,
            c.createdAt AS createdAt
        FROM Category c
        ORDER BY c.id DESC
    """)
    List<CategoryResponse> findList();

    @Query("""
        SELECT 
            c.id AS id,
            c.name AS name,
            c.slug AS slug,
            c.description AS description,
            c.createdAt AS createdAt
        FROM Category c
        WHERE c.id = :id
    """)
    Optional<CategoryResponse> findDetailById(Integer id);
}
