package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DeliveryDriverRequest;
import com.example.demo.dto.DeliveryDriverResponse;
import com.example.demo.dto.DeliveryDriverUpdateRequest;
import com.example.demo.model.DeliveryDriver;
import com.example.demo.repo.DeliveryDriverRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DeliveryDriverService {

    private final DeliveryDriverRepository deliveryDriverRepository;

    @Transactional
    public DeliveryDriverResponse create(DeliveryDriverRequest request) {
        DeliveryDriver driver = DeliveryDriver.builder()
                .fullName(request.fullName())
                .phone(request.phone())
                .email(request.email())
                .firebaseUid(request.firebaseUid())
                .authProvider(request.authProvider())
                .emailVerified(request.emailVerified())
                .photoUrl(request.photoUrl())
                .vehicleType(request.vehicleType())
                .licenseNumber(request.licenseNumber())
                .companyName(request.companyName())
                .isAvailable(true)
                .isActive(true)
                .build();

        DeliveryDriver saved = deliveryDriverRepository.save(driver);
        log.info("Delivery driver created with ID: {}", saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public DeliveryDriverResponse syncWithFirebase(DeliveryDriverRequest request) {
        // Check if driver already exists by Firebase UID
        return deliveryDriverRepository.findByFirebaseUid(request.firebaseUid())
                .map(existing -> {
                    // Update existing driver
                    if (request.fullName() != null) existing.setFullName(request.fullName());
                    if (request.phone() != null) existing.setPhone(request.phone());
                    if (request.email() != null) existing.setEmail(request.email());
                    if (request.authProvider() != null) existing.setAuthProvider(request.authProvider());
                    if (request.emailVerified() != null) existing.setEmailVerified(request.emailVerified());
                    if (request.photoUrl() != null) existing.setPhotoUrl(request.photoUrl());
                    
                    DeliveryDriver updated = deliveryDriverRepository.save(existing);
                    log.info("Delivery driver synced (updated) with Firebase UID: {}", request.firebaseUid());
                    return toResponse(updated);
                })
                .orElseGet(() -> {
                    // Create new driver
                    log.info("Creating new delivery driver from Firebase sync: {}", request.firebaseUid());
                    return create(request);
                });
    }

    public List<DeliveryDriverResponse> getAll() {
        return deliveryDriverRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public DeliveryDriverResponse getById(Integer id) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with ID: " + id));
        return toResponse(driver);
    }

    public DeliveryDriverResponse getByFirebaseUid(String firebaseUid) {
        DeliveryDriver driver = deliveryDriverRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with Firebase UID: " + firebaseUid));
        return toResponse(driver);
    }

    public List<DeliveryDriverResponse> getAvailableDrivers() {
        return deliveryDriverRepository.findByIsAvailableAndIsActive(true, true).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryDriverResponse> getByCompanyName(String companyName) {
        return deliveryDriverRepository.findByCompanyName(companyName).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public DeliveryDriverResponse update(Integer id, DeliveryDriverUpdateRequest request) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with ID: " + id));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            driver.setFullName(request.fullName());
        }

        if (request.phone() != null) {
            driver.setPhone(request.phone());
        }

        if (request.email() != null) {
            driver.setEmail(request.email());
        }

        if (request.photoUrl() != null) {
            driver.setPhotoUrl(request.photoUrl());
        }

        if (request.vehicleType() != null) {
            driver.setVehicleType(request.vehicleType());
        }

        if (request.licenseNumber() != null) {
            driver.setLicenseNumber(request.licenseNumber());
        }

        if (request.companyName() != null) {
            driver.setCompanyName(request.companyName());
        }

        if (request.isAvailable() != null) {
            driver.setIsAvailable(request.isAvailable());
        }

        if (request.isActive() != null) {
            driver.setIsActive(request.isActive());
        }

        if (request.currentLat() != null && request.currentLng() != null) {
            driver.setCurrentLat(request.currentLat());
            driver.setCurrentLng(request.currentLng());
            driver.setLastLocationUpdate(LocalDateTime.now());
        }

        DeliveryDriver updated = deliveryDriverRepository.save(driver);
        log.info("Delivery driver updated with ID: {}", id);
        return toResponse(updated);
    }

    @Transactional
    public DeliveryDriverResponse updateAvailability(Integer id, boolean isAvailable) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with ID: " + id));
        driver.setIsAvailable(isAvailable);
        DeliveryDriver updated = deliveryDriverRepository.save(driver);
        log.info("Driver {} availability set to {}", id, isAvailable);
        return toResponse(updated);
    }

    @Transactional
    public void delete(Integer id) {
        DeliveryDriver driver = deliveryDriverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery driver not found with ID: " + id));
        
        driver.setDeletedAt(LocalDateTime.now());
        deliveryDriverRepository.save(driver);
        log.info("Delivery driver soft deleted with ID: {}", id);
    }

    private DeliveryDriverResponse toResponse(DeliveryDriver driver) {
        return new DeliveryDriverResponse(
                driver.getId(),
                driver.getFullName(),
                driver.getPhone(),
                driver.getEmail(),
                driver.getFirebaseUid(),
                driver.getAuthProvider(),
                driver.getEmailVerified(),
                driver.getPhotoUrl(),
                driver.getVehicleType(),
                driver.getLicenseNumber(),
                driver.getCompanyName(),
                driver.getIsAvailable(),
                driver.getIsActive(),
                driver.getCurrentLat(),
                driver.getCurrentLng(),
                driver.getLastLocationUpdate(),
                driver.getCreatedAt());
    }
}
