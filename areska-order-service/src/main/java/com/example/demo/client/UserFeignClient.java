package com.example.demo.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.shared.Api.ApiSuccess;

@FeignClient(name = "ARESKA-USER-SERVICE")
public interface UserFeignClient {

    @GetMapping("/users/{id}")
    ApiSuccess<UserResponse> getUserById(@PathVariable Integer id);

    record UserResponse(
            Integer id,
            String firstName,
            String lastName,
            String email,
            String phone,
            String address,
            String firebaseUid,
            String authProvider,
            Boolean emailVerified,
            String photoUrl,
            java.time.LocalDateTime createdAt) {
    }
}

