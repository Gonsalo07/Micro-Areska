package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ProductRequest;
import com.example.demo.dto.ProductResponse;
import com.example.demo.dto.StockUpdateRequest;
import com.example.demo.service.ProductService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Operations related to products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "List all products")
    public ResponseEntity<ApiSuccess<List<ProductResponse>>> getAll() {
        List<ProductResponse> products = productService.getAll();
        ApiSuccess<List<ProductResponse>> response = new ApiSuccess<>(
                products.isEmpty() ? "No products found" : "Products listed successfully",
                products);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    public ResponseEntity<ApiSuccess<ProductResponse>> getById(@Min(1) @PathVariable Integer id) {
        ProductResponse product = productService.getById(id);
        return ResponseEntity.ok(new ApiSuccess<>("Product found", product));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category ID")
    public ResponseEntity<ApiSuccess<List<ProductResponse>>> getByCategoryId(@Min(1) @PathVariable Integer categoryId) {
        List<ProductResponse> products = productService.getByCategoryId(categoryId);
        ApiSuccess<List<ProductResponse>> response = new ApiSuccess<>(
                products.isEmpty() ? "No products found for this category" : "Products listed successfully",
                products);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    @Operation(summary = "Get available products (with stock > 0)")
    public ResponseEntity<ApiSuccess<List<ProductResponse>>> getAvailable() {
        List<ProductResponse> products = productService.getAvailableProducts();
        ApiSuccess<List<ProductResponse>> response = new ApiSuccess<>(
                products.isEmpty() ? "No available products found" : "Available products listed successfully",
                products);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    public ResponseEntity<ApiSuccess<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        ProductResponse created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Product created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product by ID")
    public ResponseEntity<ApiSuccess<ProductResponse>> update(@Min(1) @PathVariable Integer id,
            @Valid @RequestBody ProductRequest request) {
        ProductResponse updated = productService.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Product updated successfully", updated));
    }

    @PutMapping("/{id}/stock")
    @Operation(summary = "Update product stock (admin only)")
    public ResponseEntity<ApiSuccess<Void>> updateStock(@Min(1) @PathVariable Integer id,
            @Valid @RequestBody StockUpdateRequest request) {
        productService.updateStock(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Stock updated successfully", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product by ID")
    public ResponseEntity<ApiSuccess<Void>> delete(@Min(1) @PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok(new ApiSuccess<>("Product deleted successfully", null));
    }
}
