package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.event.EventListener;

@EnableDiscoveryClient
@SpringBootApplication
public class AreskaDeliveryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AreskaDeliveryServiceApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onReady() {
		System.out.println("");
		System.out.println("╔══════════════════════════════════════════╗");
		System.out.println("║      🚚 ARESKA DELIVERY SERVICE          ║");
		System.out.println("║      ✅ Servicio listo en puerto 8085    ║");
		System.out.println("║      📋 Swagger: /swagger-ui.html        ║");
		System.out.println("║      📊 Metrics: /actuator/prometheus    ║");
		System.out.println("╚══════════════════════════════════════════╝");
		System.out.println("");
	}

}
