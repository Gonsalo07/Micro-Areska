package com.example.demo.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.client.UserFeignClient.UserResponse;
import com.example.demo.shared.exception.ResourceNotFoundException;

import java.util.Optional;

@Component
public class UserServiceClient {

    @Autowired
    private UserFeignClient userFeignClient;

    public Optional<UserResponse> findUserById(Integer id) {
        try {
            var response = userFeignClient.getUserById(id);
            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
            return Optional.empty();
        } catch (Exception e) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
    }

    public Optional<UserResponse> findUserByFirebaseUid(String firebaseUid) {
        try {
            var response = userFeignClient.getUserByFirebaseUid(firebaseUid);
            if (response != null && response.getData() != null) {
                return Optional.of(response.getData());
            }
            return Optional.empty();
        } catch (Exception e) {
            throw new ResourceNotFoundException("User not found with firebaseUid: " + firebaseUid);
        }
    }
}
