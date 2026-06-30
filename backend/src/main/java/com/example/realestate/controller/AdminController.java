package com.example.realestate.controller;

import com.example.realestate.dto.AdminUserRequest;
import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserRequest request) {
        try {
            Set<Role> roles = request.getRoles().stream()
                    .map(this::normalizeRole)
                    .map(Role::valueOf)
                    .collect(Collectors.toSet());

            User user = userService.createUser(request.getEmail(), request.getPassword(), roles);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    private String normalizeRole(String role) {
        String normalized = role == null ? "" : role.trim().toUpperCase();
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("Perfil inválido");
        }
        return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
    }
}
