package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.ChatMessageRequest;
import com.example.demo.dto.response.ChatMessageResponse;
import com.example.demo.service.ChatMessageService;
import com.example.demo.shared.Api.ApiSuccess;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat-messages")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    /**
     * Obtener todos los mensajes de una orden
     * GET /chat-messages/order/{orderId}
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiSuccess<List<ChatMessageResponse>>> getMessagesByOrder(
            @PathVariable Integer orderId) {
        log.info("Getting messages for order ID: {}", orderId);
        List<ChatMessageResponse> messages = chatMessageService.getMessagesByOrderId(orderId);
        ApiSuccess<List<ChatMessageResponse>> response = new ApiSuccess<>(
                messages.isEmpty() ? "No messages found" : "Messages retrieved successfully",
                messages);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener mensajes NO leídos de una orden
     * GET /chat-messages/order/{orderId}/unread
     */
    @GetMapping("/order/{orderId}/unread")
    public ResponseEntity<ApiSuccess<List<ChatMessageResponse>>> getUnreadMessagesByOrder(
            @PathVariable Integer orderId) {
        log.info("Getting unread messages for order ID: {}", orderId);
        List<ChatMessageResponse> messages = chatMessageService.getUnreadMessagesByOrderId(orderId);
        ApiSuccess<List<ChatMessageResponse>> response = new ApiSuccess<>(
                messages.isEmpty() ? "No unread messages" : "Unread messages retrieved successfully",
                messages);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener un mensaje específico
     * GET /chat-messages/{messageId}
     */
    @GetMapping("/{messageId}")
    public ResponseEntity<ApiSuccess<ChatMessageResponse>> getMessageById(
            @PathVariable Integer messageId) {
        log.info("Getting message ID: {}", messageId);
        ChatMessageResponse message = chatMessageService.getMessageById(messageId);
        return ResponseEntity.ok(new ApiSuccess<>("Message found", message));
    }

    /**
     * Enviar un nuevo mensaje
     * POST /chat-messages
     */
    @PostMapping
    public ResponseEntity<ApiSuccess<ChatMessageResponse>> sendMessage(
            @Valid @RequestBody ChatMessageRequest request) {
        log.info("Sending message for order ID: {} from {} (ID: {})", 
                request.getOrderId(), request.getSenderType(), request.getSenderId());
        ChatMessageResponse response = chatMessageService.sendMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("Message sent successfully", response));
    }

    /**
     * Marcar un mensaje como leído
     * PUT /chat-messages/{messageId}/read
     */
    @PutMapping("/{messageId}/read")
    public ResponseEntity<ApiSuccess<ChatMessageResponse>> markMessageAsRead(
            @PathVariable Integer messageId) {
        log.info("Marking message ID: {} as read", messageId);
        ChatMessageResponse response = chatMessageService.markAsRead(messageId);
        return ResponseEntity.ok(new ApiSuccess<>("Message marked as read", response));
    }

    /**
     * Marcar todos los mensajes de una orden como leídos
     * PUT /chat-messages/order/{orderId}/read-all
     */
    @PutMapping("/order/{orderId}/read-all")
    public ResponseEntity<ApiSuccess<List<ChatMessageResponse>>> markAllMessagesAsRead(
            @PathVariable Integer orderId) {
        log.info("Marking all messages as read for order ID: {}", orderId);
        List<ChatMessageResponse> messages = chatMessageService.markAllAsRead(orderId);
        return ResponseEntity.ok(new ApiSuccess<>("All messages marked as read", messages));
    }

    /**
     * Eliminar un mensaje
     * DELETE /chat-messages/{messageId}
     */
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiSuccess<Void>> deleteMessage(
            @PathVariable Integer messageId) {
        log.info("Deleting message ID: {}", messageId);
        chatMessageService.deleteMessage(messageId);
        return ResponseEntity.ok(new ApiSuccess<>("Message deleted successfully", null));
    }
}
