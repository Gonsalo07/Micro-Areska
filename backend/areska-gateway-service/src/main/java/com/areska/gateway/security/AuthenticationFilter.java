package com.areska.gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;

import com.google.firebase.auth.FirebaseAuth;

import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Lazy
    @Autowired
    private RouterValidator routerValidator;

    public AuthenticationFilter() {
        super(Config.class);
    }

    public static class Config {
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();
            String method = request.getMethod().toString();

            System.out.println("\n========================================");
            System.out.println("🔥 GATEWAY INTERCEPTANDO REQUEST");
            System.out.println("➡️  METHOD: " + method);
            System.out.println("➡️  PATH: " + path);
            System.out.println("➡️  QUERY: " + request.getURI().getQuery());
            System.out.println("========================================");

            // 1️⃣ Permitir CORS preflight
            if (method.equalsIgnoreCase("OPTIONS")) {
                System.out.println("🟢 ES OPTIONS (CORS PREFLIGHT) - PERMITIDO");
                return chain.filter(exchange);
            }

            // 2️⃣ Permitir WebSocket handshake sin autenticación
            if (path.startsWith("/api/delivery-ws") || path.startsWith("/api/ws")) {
                System.out.println("🟢 ES WEBSOCKET HANDSHAKE - PERMITIDO SIN AUTH");
                return chain.filter(exchange);
            }

            // 3️⃣ Verificar si es endpoint abierto
            boolean isOpen = routerValidator.isOpenEndpoint(request);
            System.out.println("🔍 isOpenEndpoint: " + isOpen);

            if (isOpen) {
                System.out.println("🟢 ENDPOINT ABIERTO - PERMITIDO");
                return chain.filter(exchange);
            }

            System.out.println("🔒 ENDPOINT PROTEGIDO - REQUIERE AUTH");

            // 4️⃣ Verificar Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                System.out.println("❌ NO TIENE HEADER AUTHORIZATION");
                return onError(exchange, "No Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ FORMATO DE TOKEN INVÁLIDO: " + authHeader);
                return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            System.out.println("🔑 TOKEN RECIBIDO: " + token.substring(0, Math.min(20, token.length())) + "...");

            return Mono.fromCallable(() -> FirebaseAuth.getInstance().verifyIdToken(token))
                    .subscribeOn(Schedulers.boundedElastic())
                    .flatMap(decodedToken -> {

                        System.out.println("✅ TOKEN VÁLIDO");
                        System.out.println("👤 UID: " + decodedToken.getUid());
                        System.out.println("📧 EMAIL: " + decodedToken.getEmail());

                        ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                                .header("X-Firebase-UiD", decodedToken.getUid())
                                .header("X-Firebase-Email", decodedToken.getEmail())
                                .build();

                        return chain.filter(exchange.mutate().request(modifiedRequest).build());
                    })
                    .onErrorResume(e -> {
                        System.out.println("❌ ERROR VALIDANDO FIREBASE: " + e.getMessage());
                        return onError(exchange, "Invalid Token", HttpStatus.UNAUTHORIZED);
                    });
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }
}