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
        
        if (method == HttpMethod.OPTIONS) {
            return true;
        }

        if (method == HttpMethod.GET && (path.contains("/api/products") || path.contains("/api/categories"))) {
            return true;
        }
        
        if (path.contains("/api/auth") || path.contains("/eureka")) {
            return true;
        }

        if (path.contains("/api/users/firebase/sync") && method == HttpMethod.POST) {
            return true;
        }

        if (path.contains("/api/delivery-drivers/firebase/sync") && method == HttpMethod.POST) {
            return true;
        }

        return false;
    }

}
