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
            "/api/users/firebase/sync"
        );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
                    
    // Specifically allow GET requests for products and categories to be public
    // but require auth for POST/PUT/DELETE
    public boolean isOpenEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();
        
        // Allow OPTIONS requests for CORS
        if (method == HttpMethod.OPTIONS) {
            return true;
        }

        // Public read-only endpoints
        if (method == HttpMethod.GET && (path.contains("/api/products") || path.contains("/api/categories"))) {
            return true;
        }
        
        // Fully public endpoints (auth, eureka)
        if (path.contains("/api/auth") || path.contains("/eureka")) {
            return true;
        }

        return false;
    }

}
