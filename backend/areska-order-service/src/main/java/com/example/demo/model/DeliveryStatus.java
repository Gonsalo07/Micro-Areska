package com.example.demo.model;

/**
 * Estados de entrega del pedido (delivery_status)
 * Representa el ciclo de vida de la entrega a domicilio
 */
public enum DeliveryStatus {
    /**
     * Pedido pendiente de asignación a un repartidor
     * Estado inicial cuando se crea una orden con delivery
     */
    PENDING_ASSIGNMENT("PENDING_ASSIGNMENT"),
    
    /**
     * Pedido asignado a un repartidor, esperando aceptación
     */
    ASSIGNED("ASSIGNED"),
    
    /**
     * Repartidor aceptó el pedido
     */
    ACCEPTED("ACCEPTED"),
    
    /**
     * Repartidor en camino al destino
     * Chat habilitado con el cliente
     */
    OUT_FOR_DELIVERY("OUT_FOR_DELIVERY"),
    
    /**
     * Repartidor llegó al destino
     * Chat habilitado con el cliente
     */
    ARRIVED("ARRIVED"),
    
    /**
     * Pedido entregado exitosamente
     * Chat deshabilitado
     */
    DELIVERED("DELIVERED"),
    
    /**
     * Entrega cancelada
     */
    CANCELLED("CANCELLED");

    private final String value;

    DeliveryStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static DeliveryStatus fromValue(String value) {
        for (DeliveryStatus status : DeliveryStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown DeliveryStatus: " + value);
    }
    
    /**
     * Verifica si el estado permite chat entre repartidor y cliente
     */
    public boolean isChatEnabled() {
        return this == OUT_FOR_DELIVERY || this == ARRIVED;
    }
    
    /**
     * Verifica si la orden está activa (no finalizada)
     */
    public boolean isActive() {
        return this != DELIVERED && this != CANCELLED;
    }
}
