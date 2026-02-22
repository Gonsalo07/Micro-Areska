package com.example.demo.controller;

import com.example.demo.dto.PaymentCreateRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.service.PaymentService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Operaciones relacionadas con pagos")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Listar todos los pagos")
    public ResponseEntity<ApiSuccess<List<PaymentResponse>>> listAllPayments() {
        List<PaymentResponse> payments = paymentService.getAll();
        ApiSuccess<List<PaymentResponse>> response = new ApiSuccess<>(
                payments.isEmpty() ? "No payments found" : "Payments listed successfully",
                payments);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Obtener el pago por ID de la orden")
    public ResponseEntity<ApiSuccess<List<PaymentResponse>>> getByOrderId(@PathVariable Integer orderId) {
        List<PaymentResponse> payments = paymentService.getByOrderId(orderId);
        ApiSuccess<List<PaymentResponse>> response = new ApiSuccess<>(
                payments.isEmpty() ? "No payments found for this order" : "Payments retrieved successfully",
                payments);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo pago para una orden")
    public ResponseEntity<ApiSuccess<PaymentResponse>> createPayment(@RequestBody PaymentCreateRequest request) {
        PaymentResponse created = paymentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Payment created successfully", created));
    }

    @DeleteMapping("/{paymentId}")
    @Operation(summary = "Eliminar un pago por su ID")
    public ResponseEntity<ApiSuccess<Void>> deletePayment(@PathVariable Integer paymentId) {
        paymentService.deleteById(paymentId);
        return ResponseEntity.ok(new ApiSuccess<>("Payment deleted successfully", null));
    }
}