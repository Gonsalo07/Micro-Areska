package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request para actualizar un detalle de entrega.
 * Usado por drivers y admins para cambiar estado, asignar driver, agregar notas, etc.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDeliveryDetailUpdateRequest {
    
    // Para asignar/cambiar driver (solo admin)
    private Integer deliveryDriverId;
    
    // Para actualizar estado
    private String status;
    
    // Notas del driver
    private String driverNotes;
    
    // Motivo de cancelación (requerido si status = CANCELLED)
    private String cancellationReason;
}
