package com.example.demo.model;

/**
 * Estados del pedido (status)
 * Representa el estado general de la orden desde la perspectiva del negocio
 */
public enum OrderStatus {
    /**
     * Pedido recién creado, pendiente de confirmación
     */
    PENDING("pending"),
    
    /**
     * Pedido confirmado y en preparación
     */
    CONFIRMED("confirmed"),
    
    /**
     * Pedido siendo preparado en cocina/almacén
     */
    PREPARING("preparing"),
    
    /**
     * Pedido listo para ser recogido o entregado
     */
    READY("ready"),
    
    /**
     * Pedido completado exitosamente
     */
    COMPLETED("completed"),
    
    /**
     * Pedido cancelado
     */
    CANCELLED("cancelled");

    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static OrderStatus fromValue(String value) {
        for (OrderStatus status : OrderStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown OrderStatus: " + value);
    }
}
