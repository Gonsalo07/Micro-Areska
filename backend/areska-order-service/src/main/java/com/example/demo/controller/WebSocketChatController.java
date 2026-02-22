package com.example.demo.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.dto.request.ChatMessageRequest;
import com.example.demo.dto.response.ChatMessageResponse;
import com.example.demo.service.ChatMessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class WebSocketChatController {

    private final ChatMessageService chatMessageService;

    /**
     * Recibe mensajes del cliente en /app/chat/{orderId}
     * y los envía a todos los suscriptores en /topic/chat/{orderId}
     */
    @MessageMapping("/chat/{orderId}")
    public void sendMessage(@DestinationVariable Integer orderId, @Payload ChatMessageRequest request) {
        log.info("📨 Mensaje recibido para orden {}: {}", orderId, request.getMessage());
        
        try {
            // El servicio guarda el mensaje Y hace el broadcast por WebSocket automáticamente
            ChatMessageResponse savedMessage = chatMessageService.sendMessage(request);
            log.info("✅ Mensaje guardado con ID: {} y enviado a /topic/chat/{}", savedMessage.id(), orderId);
            
        } catch (Exception e) {
            log.error("❌ Error procesando mensaje para orden {}: {}", orderId, e.getMessage(), e);
        }
    }
}
