package com.example.demo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "delivery_drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDriver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(unique = true, length = 150)
    private String email;

    @Column(name = "firebase_uid", unique = true, length = 128)
    private String firebaseUid;

    @Column(name = "auth_provider", length = 32)
    private String authProvider;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "vehicle_type", length = 50)
    private String vehicleType;

    @Column(name = "license_number", length = 100)
    private String licenseNumber;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "current_lat", precision = 10, scale = 8)
    private BigDecimal currentLat;

    @Column(name = "current_lng", precision = 11, scale = 8)
    private BigDecimal currentLng;

    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
