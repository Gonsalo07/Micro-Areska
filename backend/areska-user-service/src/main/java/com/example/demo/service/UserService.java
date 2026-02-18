package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.UserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.model.User;
import com.example.demo.repo.UserRepository;
import com.example.demo.shared.exception.AccountDisabledException;
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
                .filter(user -> user.getDeletedAt() == null)
                .map(this::toResponse);
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("User with email " + request.email() + " already exists");
        }

        if (request.firebaseUid() != null && !request.firebaseUid().isBlank()) {
            if (userRepository.findByFirebaseUid(request.firebaseUid()).isPresent()) {
                throw new IllegalArgumentException(
                        "User with Firebase UID " + request.firebaseUid() + " already exists");
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
    public UserResponse syncWithFirebase(UserRequest request) {
        Optional<User> existingUser = userRepository.findByFirebaseUid(request.firebaseUid());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.getDeletedAt() != null) {
                // Crisp practice: "Sync no debe revivir usuarios eliminados".
                throw new AccountDisabledException("Account is deleted");
            }

            boolean updated = false;
            if (request.photoUrl() != null && !request.photoUrl().equals(user.getPhotoUrl())) {
                user.setPhotoUrl(request.photoUrl());
                updated = true;
            }
            if (request.emailVerified() != null && !request.emailVerified().equals(user.getEmailVerified())) {
                user.setEmailVerified(request.emailVerified());
                updated = true;
            }

            if (updated) {
                user = userRepository.save(user);
            }
            return toResponse(user);
        }

        Optional<User> userByEmail = userRepository.findByEmail(request.email());
        if (userByEmail.isPresent()) {
            User user = userByEmail.get();
            if (user.getDeletedAt() != null) {
                throw new AccountDisabledException("Account is deleted");
            }

            user.setFirebaseUid(request.firebaseUid());
            user.setAuthProvider(request.authProvider());
            if (request.photoUrl() != null)
                user.setPhotoUrl(request.photoUrl());
            if (request.emailVerified() != null)
                user.setEmailVerified(request.emailVerified());

            user = userRepository.save(user);
            return toResponse(user);
        }

        User newUser = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName() != null ? request.lastName() : "")
                .email(request.email())
                .firebaseUid(request.firebaseUid())
                .authProvider(request.authProvider())
                .emailVerified(request.emailVerified())
                .photoUrl(request.photoUrl())
                .phone(request.phone() != null ? request.phone() : "")
                .address(request.address() != null ? request.address() : "")
                .build();

        User saved = userRepository.save(newUser);
        return toResponse(saved);
    }

    @Transactional
    public UserResponse update(Integer id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (!user.getEmail().equals(request.email())) {
            if (userRepository.findByEmail(request.email()).isPresent()) {
                throw new IllegalArgumentException("User with email " + request.email() + " already exists");
            }
        }

        if (request.firebaseUid() != null && !request.firebaseUid().isBlank()) {
            if (!request.firebaseUid().equals(user.getFirebaseUid())) {
                if (userRepository.findByFirebaseUid(request.firebaseUid()).isPresent()) {
                    throw new IllegalArgumentException(
                            "User with Firebase UID " + request.firebaseUid() + " already exists");
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
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        user.setDeletedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
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
                user.getRole().name(),
                user.getCreatedAt());
    }
}
