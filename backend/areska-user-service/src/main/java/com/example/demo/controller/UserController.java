package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UserRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.service.UserService;
import com.example.demo.shared.Api.ApiSuccess;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Operations related to users")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "List all users")
    public ResponseEntity<ApiSuccess<List<UserResponse>>> getAll() {
        List<UserResponse> users = userService.getAll();
        ApiSuccess<List<UserResponse>> response = new ApiSuccess<>(
                users.isEmpty() ? "No users found" : "Users listed successfully",
                users);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user by ID")
    public ResponseEntity<ApiSuccess<UserResponse>> getById(@Min(1) @PathVariable Integer id) {
        UserResponse user = userService.getById(id);
        return ResponseEntity.ok(new ApiSuccess<>("User found", user));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get a user by email")
    public ResponseEntity<ApiSuccess<UserResponse>> getByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(user -> ResponseEntity.ok(new ApiSuccess<>("User found", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/firebase/{firebaseUid}")
    @Operation(summary = "Get a user by Firebase UID")
    public ResponseEntity<ApiSuccess<UserResponse>> getByFirebaseUid(@PathVariable String firebaseUid) {
        return userService.findByFirebaseUid(firebaseUid)
                .map(user -> ResponseEntity.ok(new ApiSuccess<>("User found", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiSuccess<UserResponse>> getMyProfile(
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Firebase-UiD", required = false) String firebaseUid) {
        if (firebaseUid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return userService.findByFirebaseUid(firebaseUid)
                .map(user -> ResponseEntity.ok(new ApiSuccess<>("User found", user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/firebase/sync")
    @Operation(summary = "Sync user with Firebase")
    public ResponseEntity<ApiSuccess<UserResponse>> syncWithFirebase(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.syncWithFirebase(request);
        return ResponseEntity.ok(new ApiSuccess<>("User synced successfully", response));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete current user account (soft delete)")
    public ResponseEntity<?> deleteMyAccount(
            @org.springframework.web.bind.annotation.RequestHeader(value = "X-Firebase-UiD", required = false) String firebaseUid) {
        if (firebaseUid == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return userService.findByFirebaseUid(firebaseUid)
                .map(user -> {
                    userService.delete(user.id());
                    return ResponseEntity.ok(new ApiSuccess<>("Account deleted successfully", null));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<ApiSuccess<UserResponse>> create(@Valid @RequestBody UserRequest request) {
        UserResponse created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiSuccess<>("User created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a user by ID")
    public ResponseEntity<ApiSuccess<UserResponse>> update(@Min(1) @PathVariable Integer id,
            @Valid @RequestBody UserRequest request) {
        UserResponse updated = userService.update(id, request);
        return ResponseEntity.ok(new ApiSuccess<>("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user by ID")
    public ResponseEntity<ApiSuccess<Void>> delete(@Min(1) @PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.ok(new ApiSuccess<>("User deleted successfully", null));
    }
}
