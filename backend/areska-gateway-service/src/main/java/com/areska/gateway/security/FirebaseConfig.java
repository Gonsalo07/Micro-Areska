package com.areska.gateway.security;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.path:firebase-service-account.json}")
    private String firebaseConfigPath;

    @Value("${firebase.credentials-json:}")
    private String firebaseCredentialsJson;

    // Variables individuales
    @Value("${FIREBASE_TYPE:}") private String type;
    @Value("${FIREBASE_PROJECT_ID:}") private String projectId;
    @Value("${FIREBASE_PRIVATE_KEY_ID:}") private String privateKeyId;
    @Value("${FIREBASE_PRIVATE_KEY:}") private String privateKey;
    @Value("${FIREBASE_CLIENT_EMAIL:}") private String clientEmail;
    @Value("${FIREBASE_CLIENT_ID:}") private String clientId;
    @Value("${FIREBASE_AUTH_URI:}") private String authUri;
    @Value("${FIREBASE_TOKEN_URI:}") private String tokenUri;
    @Value("${FIREBASE_AUTH_PROVIDER_CERT_URL:}") private String authProviderCertUrl;
    @Value("${FIREBASE_CLIENT_CERT_URL:}") private String clientCertUrl;

    @PostConstruct
    public void initialize() {
        try {
            // Check if FirebaseApp is already initialized
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccount = null;

                // Priority 1: Environment Variable (Full JSON Content)
                if (firebaseCredentialsJson != null && !firebaseCredentialsJson.isBlank()) {
                    // Reemplaza los saltos de línea escapados por saltos reales
                    String cleanJson = firebaseCredentialsJson.replace("\\n", "\n");
                    serviceAccount = new ByteArrayInputStream(cleanJson.getBytes(StandardCharsets.UTF_8));
                    System.out.println("Initializing Firebase from Environment Variable JSON content (with fixed newlines)");
                } 
                // Priority 2: Individual Environment Variables
                else if (projectId != null && !projectId.isBlank() && privateKey != null && !privateKey.isBlank()) {
                     // Sanitize private key - replace escaped newlines
                     String sanitizedPrivateKey = privateKey.replace("\\n", "\n");
                     System.out.println("Initializing Firebase from Individual Environment Variables");
                     String jsonContent = String.format("{"
                            + "\"type\": \"%s\","
                            + "\"project_id\": \"%s\","
                            + "\"private_key_id\": \"%s\","
                            + "\"private_key\": \"%s\","
                            + "\"client_email\": \"%s\","
                            + "\"client_id\": \"%s\","
                            + "\"auth_uri\": \"%s\","
                            + "\"token_uri\": \"%s\","
                            + "\"auth_provider_x509_cert_url\": \"%s\","
                            + "\"client_x509_cert_url\": \"%s\""
                            + "}",
                            type, projectId, privateKeyId, sanitizedPrivateKey.replace("\n", "\\n"), clientEmail, clientId, 
                            authUri, tokenUri, authProviderCertUrl, clientCertUrl);
                    
                    serviceAccount = new ByteArrayInputStream(jsonContent.getBytes(StandardCharsets.UTF_8));
                    System.out.println("Initializing Firebase from Individual Environment Variables");
                }
                // Priority 3: File Path
                else {
                    System.out.println("Initializing Firebase from File: " + firebaseConfigPath);
                    try (InputStream is = new FileInputStream(firebaseConfigPath)) {
                        ObjectMapper mapper = new ObjectMapper();
                        @SuppressWarnings("unchecked")
                        Map<String, Object> keyMap = mapper.readValue(is, Map.class);
                        
                        // Create a clean map with only necessary fields to avoid parsing errors with new/extra fields
                        Map<String, Object> cleanMap = new java.util.HashMap<>();
                        cleanMap.put("type", keyMap.getOrDefault("type", "service_account"));
                        cleanMap.put("project_id", keyMap.get("project_id"));
                        cleanMap.put("private_key_id", keyMap.get("private_key_id"));
                        cleanMap.put("client_email", keyMap.get("client_email"));
                        cleanMap.put("client_id", keyMap.get("client_id"));
                        cleanMap.put("auth_uri", keyMap.getOrDefault("auth_uri", "https://accounts.google.com/o/oauth2/auth"));
                        cleanMap.put("token_uri", keyMap.getOrDefault("token_uri", "https://oauth2.googleapis.com/token"));
                        cleanMap.put("auth_provider_x509_cert_url", "https://www.googleapis.com/oauth2/v1/certs");
                        
                        String key = (String) keyMap.get("private_key");
                        if (key != null) {
                            if (!key.contains("\n") && key.contains("\\n")) {
                                key = key.replace("\\n", "\n");
                            }
                            if (key.indexOf(".") >= 0) {
                                System.err.println("WARNING: Detected '.' in private key. Removing it.");
                                key = key.replace(".", "");
                            }
                            cleanMap.put("private_key", key);
                        }
                        
                        String jsonString = mapper.writeValueAsString(cleanMap);
                        serviceAccount = new ByteArrayInputStream(jsonString.getBytes(StandardCharsets.UTF_8));
                        System.out.println("Reconstructed clean JSON for Firebase initialization");
                    }
                }

                if (serviceAccount != null) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();

                    FirebaseApp.initializeApp(options);
                    System.out.println("Firebase Application has been initialized");
                }
            }
        } catch (Exception e) {
            System.err.println("Error initializing Firebase: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
