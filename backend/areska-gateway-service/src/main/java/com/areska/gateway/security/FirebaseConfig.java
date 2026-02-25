package com.areska.gateway.security;

import java.io.FileInputStream;
import java.io.InputStream;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.path:firebase-service-account.json}")
    private String firebaseConfigPath;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                System.out.println("Initializing Firebase from file: " + firebaseConfigPath);
                try (InputStream serviceAccount = new FileInputStream(firebaseConfigPath)) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                    FirebaseApp.initializeApp(options);
                    System.out.println("✅ Firebase initialized successfully");
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error initializing Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
