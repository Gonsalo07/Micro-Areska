package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.UserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.repo.UserRepository;
import com.example.demo.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return toResponse(user);
    }

    public Optional<UserResponse> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toResponse);
    }

    public Optional<UserResponse> findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .map(this::toResponse);
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("User with email " + request.email() + " already exists");
        }

        // Check if firebaseUid already exists (if provided)
        if (request.firebaseUid() != null && !request.firebaseUid().isBlank()) {
            if (userRepository.findByFirebaseUid(request.firebaseUid()).isPresent()) {
                throw new IllegalArgumentException("User with Firebase UID " + request.firebaseUid() + " already exists");
            }
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .phone(request.phone())
                .address(request.address())
                .firebaseUid(request.firebaseUid())
                .authProvider(request.authProvider())
                .emailVerified(request.emailVerified())
                .photoUrl(request.photoUrl())
                .build();

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Transactional
    public UserResponse update(Integer id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(request.email())) {
            if (userRepository.findByEmail(request.email()).isPresent()) {
                throw new IllegalArgumentException("User with email " + request.email() + " already exists");
            }
        }

        // Check if firebaseUid is being changed and if it already exists
        if (request.firebaseUid() != null && !request.firebaseUid().isBlank()) {
            if (!request.firebaseUid().equals(user.getFirebaseUid())) {
                if (userRepository.findByFirebaseUid(request.firebaseUid()).isPresent()) {
                    throw new IllegalArgumentException("User with Firebase UID " + request.firebaseUid() + " already exists");
                }
            }
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setFirebaseUid(request.firebaseUid());
        user.setAuthProvider(request.authProvider());
        user.setEmailVerified(request.emailVerified());
        user.setPhotoUrl(request.photoUrl());

        User updated = userRepository.save(user);
        return toResponse(updated);
    }

    @Transactional
    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getFirebaseUid(),
                user.getAuthProvider(),
                user.getEmailVerified(),
                user.getPhotoUrl(),
                user.getCreatedAt());
    }
}
