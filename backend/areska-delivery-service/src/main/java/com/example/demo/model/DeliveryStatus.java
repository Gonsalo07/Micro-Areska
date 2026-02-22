package com.example.demo.model;

/**
 * Estados de entrega para OrderDeliveryDetail
 */
public enum DeliveryStatus {
    PENDING_ASSIGNMENT("PENDING_ASSIGNMENT"),
    ASSIGNED("ASSIGNED"),
    ACCEPTED("ACCEPTED"),
    PICKED_UP("PICKED_UP"),
    OUT_FOR_DELIVERY("OUT_FOR_DELIVERY"),
    ARRIVED("ARRIVED"),
    DELIVERED("DELIVERED"),
    CANCELLED("CANCELLED");

    private final String value;

    DeliveryStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static DeliveryStatus fromValue(String value) {
        for (DeliveryStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid delivery status: " + value);
    }
}
