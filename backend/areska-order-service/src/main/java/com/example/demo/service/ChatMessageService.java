package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.ChatMessageRequest;
import com.example.demo.dto.response.ChatMessageResponse;
import com.example.demo.model.ChatMessage;
import com.example.demo.model.Order;
import com.example.demo.repo.ChatMessageRepository;
import com.example.demo.repo.OrderRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Obtener todos los mensajes de un order específico
     */
    public List<ChatMessageResponse> getMessagesByOrderId(Integer orderId) {
        // Verificar que la orden existe
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        
        List<ChatMessage> messages = chatMessageRepository.findByOrderIdOrderBySentAtAsc(orderId);
        
        log.info("Retrieved {} messages for order ID: {}", messages.size(), orderId);
        
        return messages.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Obtener mensajes NO leídos de una orden
     */
    public List<ChatMessageResponse> getUnreadMessagesByOrderId(Integer orderId) {
        // Verificar que la orden existe
        orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        
        List<ChatMessage> messages = chatMessageRepository.findByOrderIdAndReadAtIsNull(orderId);
        
        log.info("Retrieved {} unread messages for order ID: {}", messages.size(), orderId);
        
        return messages.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Enviar un mensaje de chat
     */
    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        // Verificar que la orden existe
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + request.getOrderId()));
        
        // Crear el mensaje
        ChatMessage message = ChatMessage.builder()
                .orderId(request.getOrderId())
                .senderType(request.getSenderType())
                .senderId(request.getSenderId())
                .message(request.getMessage())
                .messageType(request.getMessageType() != null ? request.getMessageType() : "TEXT")
                .build();
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        ChatMessageResponse response = toResponse(savedMessage);
        
        // Enviar notificación por WebSocket a todos los subscriptores del topic de la orden
        messagingTemplate.convertAndSend("/topic/chat/" + request.getOrderId(), response);
        
        log.info("Message sent for order ID: {} by {} (ID: {}) and broadcasted via WebSocket", 
                request.getOrderId(), request.getSenderType(), request.getSenderId());
        
        return response;
    }

    /**
     * Marcar un mensaje como leído
     */
    @Transactional
    public ChatMessageResponse markAsRead(Integer messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));
        
        if (message.getReadAt() == null) {
            message.setReadAt(LocalDateTime.now());
            chatMessageRepository.save(message);
            log.info("Message ID: {} marked as read", messageId);
        }
        
        return toResponse(message);
    }

    /**
     * Marcar todos los mensajes de una orden como leídos
     */
    @Transactional
    public List<ChatMessageResponse> markAllAsRead(Integer orderId) {
        // Verificar que la orden existe
        orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        
        List<ChatMessage> unreadMessages = chatMessageRepository.findByOrderIdAndReadAtIsNull(orderId);
        
        LocalDateTime now = LocalDateTime.now();
        unreadMessages.forEach(message -> message.setReadAt(now));
        
        List<ChatMessage> updatedMessages = chatMessageRepository.saveAll(unreadMessages);
        
        log.info("Marked {} messages as read for order ID: {}", updatedMessages.size(), orderId);
        
        return updatedMessages.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Obtener un mensaje específico
     */
    public ChatMessageResponse getMessageById(Integer messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));
        
        return toResponse(message);
    }

    /**
     * Eliminar un mensaje (soft delete si lo prefieres, o hard delete)
     */
    @Transactional
    public void deleteMessage(Integer messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));
        
        chatMessageRepository.delete(message);
        
        log.info("Message ID: {} deleted", messageId);
    }

    /**
     * Convertir entidad a DTO
     */
    private ChatMessageResponse toResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getOrderId(),
                message.getSenderType(),
                message.getSenderId(),
                message.getMessage(),
                message.getMessageType(),
                message.getSentAt(),
                message.getReadAt(),
                message.getReadAt() != null
        );
    }
}
