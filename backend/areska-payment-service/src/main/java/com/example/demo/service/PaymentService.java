package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.client.OrderServiceClient;
import com.example.demo.dto.PaymentCreateRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.model.Payment;
import com.example.demo.repo.PaymentRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderServiceClient orderServiceClient;

    @Transactional
    public PaymentResponse create(PaymentCreateRequest req) {
        // Validar que la orden existe usando Feign
        var orderResponse = orderServiceClient.findOrderById(req.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + req.getOrderId()));

        // Validar que el monto coincide
        if (orderResponse.total().compareTo(req.getAmount()) != 0) {
            throw new IllegalArgumentException("El monto del pago no coincide con el total de la orden.");
        }

        Payment payment = Payment.builder()
                .orderId(req.getOrderId())
                .method(req.getMethod())
                .amount(req.getAmount())
                .build();

        return toResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAll() {
        return paymentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PaymentResponse> getByOrderId(Integer orderId) {
        List<Payment> payments = paymentRepository.findAllByOrderId(orderId);

        if (payments.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron pagos para la orden ID: " + orderId);
        }
        return payments.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteById(Integer paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new ResourceNotFoundException("Pago no encontrado con ID: " + paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(
                p.getId(),
                p.getOrderId(),
                p.getMethod(),
                p.getAmount(),
                p.getPaymentDate());
    }
}
