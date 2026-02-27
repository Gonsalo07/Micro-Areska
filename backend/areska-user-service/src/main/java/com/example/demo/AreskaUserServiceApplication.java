package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.event.EventListener;

@EnableDiscoveryClient
@SpringBootApplication
public class AreskaUserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AreskaUserServiceApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onReady() {
		System.out.println("");
		System.out.println("╔══════════════════════════════════════════╗");
		System.out.println("║      👤 ARESKA USER SERVICE              ║");
		System.out.println("║      ✅ Servicio listo en puerto 8081    ║");
		System.out.println("║      📋 Swagger: /swagger-ui.html        ║");
		System.out.println("║      📊 Metrics: /actuator/prometheus    ║");
		System.out.println("╚══════════════════════════════════════════╝");
		System.out.println("");
	}

}
