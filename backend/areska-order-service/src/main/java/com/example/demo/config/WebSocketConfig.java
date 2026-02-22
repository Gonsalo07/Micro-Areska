package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to send messages to clients
        // Prefixed with "/topic" for broadcasts
        config.enableSimpleBroker("/topic", "/queue");
        
        // Prefix for messages from clients
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/ws" endpoint for WebSocket connections
        // SockJS requires allowedOriginPatterns for CORS validation during handshake
        // Using "*" because Gateway already validates allowed origins
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Required for SockJS CORS handshake
                .withSockJS(); // Enable SockJS fallback
    }
}
