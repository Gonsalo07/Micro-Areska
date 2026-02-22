package com.areska.gateway.security;

import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

        public static final List<String> openApiEndpoints = List.of(
            "/api/products",
            "/api/categories",
            "/api/auth",
            "/eureka",
            "/api/users/firebase/sync",
            "/api/delivery-drivers/firebase/sync"
        );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
                    
    public boolean isOpenEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();
        
        System.out.println("📋 RouterValidator evaluando: " + method + " " + path);
        
        if (method == HttpMethod.OPTIONS) {
            System.out.println("   ➡️ OPTIONS request - Abierto para CORS");
            return true;
        }

        if (method == HttpMethod.GET && (path.contains("/api/products") || path.contains("/api/categories"))) {
            System.out.println("   ➡️ GET Products/Categories - Abierto");
            return true;
        }
        
        if (path.contains("/api/auth") || path.contains("/eureka")) {
            System.out.println("   ➡️ Auth/Eureka - Abierto");
            return true;
        }

        if (path.contains("/api/users/firebase/sync") && method == HttpMethod.POST) {
            System.out.println("   ➡️ Firebase Sync Users - Abierto");
            return true;
        }

        if (path.contains("/api/delivery-drivers/firebase/sync") && method == HttpMethod.POST) {
            System.out.println("   ➡️ Firebase Sync Drivers - Abierto");
            return true;
        }

        // WebSocket endpoint - debe estar abierto para handshake
        if (path.contains("/api/ws") || 
            path.contains("/api/chat-messages") || 
            path.contains("/api/delivery-ws")) {
            System.out.println("   ➡️ ✅ WebSocket/Chat endpoint - Abierto para handshake");
            System.out.println("   🔍 Path: '" + path + "'");
            System.out.println("   🔍 Contiene /api/delivery-ws? " + path.contains("/api/delivery-ws"));
            System.out.println("   🔍 Contiene /api/ws? " + path.contains("/api/ws"));
            System.out.println("   🔍 Query: " + request.getURI().getQuery());
            return true;
        }

        // TODO: TEMPORAL - Para testing del delivery service (REMOVER EN PRODUCCIÓN)
        if (path.contains("/api/order-deliveries") || 
            path.contains("/api/deliveries") || 
            path.contains("/api/delivery-drivers")) {
            System.out.println("   ➡️ Delivery endpoints - TEMPORALMENTE Abierto (TESTING)");
            return true;
        }

        System.out.println("   ➡️ Endpoint PROTEGIDO - Requiere autenticación");
        return false;
    }

}
