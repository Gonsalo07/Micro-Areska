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

import com.example.demo.dto.DeliveryDriverRequest;
import com.example.demo.dto.DeliveryDriverResponse;
import com.example.demo.dto.DeliveryDriverUpdateRequest;
import com.example.demo.service.DeliveryDriverService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/delivery-drivers")
@RequiredArgsConstructor
@Tag(name = "Delivery Drivers", description = "Operations related to delivery drivers")
public class DeliveryDriverController {

    private final DeliveryDriverService deliveryDriverService;

    @GetMapping
    @Operation(summary = "List all delivery drivers")
    public ResponseEntity<ApiSuccess<List<DeliveryDriverResponse>>> getAll() {
        List<DeliveryDriverResponse> drivers = deliveryDriverService.getAll();
        ApiSuccess<List<DeliveryDriverResponse>> response = new ApiSuccess<>(
                drivers.isEmpty() ? "No delivery drivers found" : "Delivery drivers listed successfully",
                drivers);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a delivery driver by ID")
    public ResponseEntity<ApiSuccess<DeliveryDriverResponse>> getById(@Min(1) @PathVariable Integer id) {
        DeliveryDriverResponse driver = deliveryDriverService.getById(id);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery driver found", driver));
    }

    @GetMapping("/firebase/{firebaseUid}")
    @Operation(summary = "Get a delivery driver by Firebase UID")
    public ResponseEntity<ApiSuccess<DeliveryDriverResponse>> getByFirebaseUid(@PathVariable String firebaseUid) {
        DeliveryDriverResponse driver = deliveryDriverService.getByFirebaseUid(firebaseUid);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery driver found", driver));
    }

    @PostMapping("/firebase/sync")
    @Operation(summary = "Sync a delivery driver with Firebase (create or update)")
    public ResponseEntity<ApiSuccess<DeliveryDriverResponse>> syncWithFirebase(@Valid @RequestBody DeliveryDriverRequest request) {
        DeliveryDriverResponse driver = deliveryDriverService.syncWithFirebase(request);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery driver synced successfully", driver));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available and active delivery drivers")
    public ResponseEntity<ApiSuccess<List<DeliveryDriverResponse>>> getAvailableDrivers() {
        List<DeliveryDriverResponse> drivers = deliveryDriverService.getAvailableDrivers();
        ApiSuccess<List<DeliveryDriverResponse>> response = new ApiSuccess<>(
                drivers.isEmpty() ? "No available drivers found" : "Available drivers listed successfully",
                drivers);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/company/{companyName}")
    @Operation(summary = "Get delivery drivers by company name")
    public ResponseEntity<ApiSuccess<List<DeliveryDriverResponse>>> getByCompanyName(@PathVariable String companyName) {
        List<DeliveryDriverResponse> drivers = deliveryDriverService.getByCompanyName(companyName);
        ApiSuccess<List<DeliveryDriverResponse>> response = new ApiSuccess<>(
                drivers.isEmpty() ? "No drivers found for this company" : "Drivers listed successfully",
                drivers);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create a new delivery driver")
    public ResponseEntity<ApiSuccess<DeliveryDriverResponse>> create(@Valid @RequestBody DeliveryDriverRequest request) {
        DeliveryDriverResponse created = deliveryDriverService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Delivery driver created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a delivery driver by ID")
    public ResponseEntity<ApiSuccess<DeliveryDriverResponse>> update(@Min(1) @PathVariable Integer id,
            @Valid @RequestBody DeliveryDriverUpdateRequest request) {
        DeliveryDriverResponse updated = deliveryDriverService.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery driver updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a delivery driver by ID")
    public ResponseEntity<ApiSuccess<Void>> delete(@Min(1) @PathVariable Integer id) {
        deliveryDriverService.delete(id);
        return ResponseEntity.ok(new ApiSuccess<>("Delivery driver deleted successfully", null));
    }
}
