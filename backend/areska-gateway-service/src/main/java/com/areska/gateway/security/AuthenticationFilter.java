package com.areska.gateway.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy; // Para el error de inyección circular
import org.springframework.stereotype.Component;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers; // Para el manejo de hilos de Firebase

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Lazy
    @Autowired
    private RouterValidator routerValidator;

    public AuthenticationFilter() {
        super(Config.class);
    }

    public static class Config {
        // Put configuration properties here
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 0. Skip authentication for open endpoints
            if (routerValidator.isOpenEndpoint(request)) {
                return chain.filter(exchange);
            }

            // 1. Check for Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                System.out.println("Solicitud rechazada: No tiene header Authorization. URL: " + request.getURI());
                return onError(exchange, "No Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Solicitud rechazada: Formato de token inválido. Header: " + authHeader);
                return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            return Mono.fromCallable(() -> FirebaseAuth.getInstance().verifyIdToken(token))
                    .subscribeOn(Schedulers.boundedElastic()) // Ejecuta en un hilo separado
                    .flatMap(decodedToken -> {
                        System.out.println("Token verificado: " + decodedToken.getUid());
                        ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                                .header("X-Firebase-UiD", decodedToken.getUid())
                                .header("X-Firebase-Email", decodedToken.getEmail())
                                .build();
                        return chain.filter(exchange.mutate().request(modifiedRequest).build());
                    })
                    .onErrorResume(e -> {
                        System.err.println("Error Firebase: " + e.getMessage());
                        return onError(exchange, "Invalid Token", HttpStatus.UNAUTHORIZED);
                    });
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }
}
