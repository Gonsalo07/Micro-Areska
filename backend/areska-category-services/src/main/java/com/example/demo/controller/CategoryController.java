package com.example.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CategoryRequest;
import com.example.demo.dto.CategoryResponse;
import com.example.demo.service.CategoryService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Operations related to categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "List all categories")
    public ResponseEntity<ApiSuccess<List<CategoryResponse>>> list() {
        List<CategoryResponse> categories = categoryService.getList();
        ApiSuccess<List<CategoryResponse>> response = new ApiSuccess<>(
                categories.isEmpty() ? "No categories found" : "Categories listed successfully",
                categories);

        HttpStatus status = categories.isEmpty() ? HttpStatus.NO_CONTENT : HttpStatus.OK;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID")
    public ResponseEntity<ApiSuccess<CategoryResponse>> get(@PathVariable Integer id) {
        CategoryResponse category = categoryService.getDetailById(id);
        return ResponseEntity.ok(new ApiSuccess<>("Category found", category));
    }

    @PostMapping
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiSuccess<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Category created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a category by ID")
    public ResponseEntity<ApiSuccess<CategoryResponse>> update(@PathVariable Integer id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse updated = categoryService.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Category updated successfully", updated));
    }
}
