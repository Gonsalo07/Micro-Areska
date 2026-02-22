package com.example.demo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa el detalle de entrega de una orden.
 * Se crea automáticamente cuando una orden tiene pickup_method = 'delivery'.
 * 
 * Estados de entrega (status):
 *   - PENDING_ASSIGNMENT : Pendiente de asignación a repartidor
 *   - ASSIGNED           : Asignado a repartidor, esperando aceptación
 *   - ACCEPTED           : Repartidor aceptó el pedido
 *   - PICKED_UP          : Repartidor recogió el pedido del local
 *   - OUT_FOR_DELIVERY   : Repartidor en camino (chat habilitado)
 *   - ARRIVED            : Repartidor llegó al destino (chat habilitado)
 *   - DELIVERED          : Pedido entregado (chat deshabilitado)
 *   - CANCELLED          : Entrega cancelada
 */
@Entity
@Table(name = "order_delivery_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDeliveryDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id", unique = true, nullable = false)
    private Integer orderId;

    // Customer info (desde la orden)
    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_driver_id")
    private DeliveryDriver deliveryDriver;

    // Destino de entrega
    @Column(name = "destination_address", nullable = false, columnDefinition = "TEXT")
    private String destinationAddress;

    @Column(name = "destination_lat", precision = 10, scale = 8)
    private BigDecimal destinationLat;

    @Column(name = "destination_lng", precision = 11, scale = 8)
    private BigDecimal destinationLng;

    @Column(name = "destination_reference", columnDefinition = "TEXT")
    private String destinationReference;

    // Comentarios
    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;

    @Column(name = "driver_notes", columnDefinition = "TEXT")
    private String driverNotes;

    // Estado de la entrega
    @Column(name = "status", length = 30)
    @Builder.Default
    private String status = "PENDING_ASSIGNMENT";

    // Timestamps de seguimiento
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "out_for_delivery_at")
    private LocalDateTime outForDeliveryAt;

    @Column(name = "arrived_at")
    private LocalDateTime arrivedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // Motivo de cancelación
    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
