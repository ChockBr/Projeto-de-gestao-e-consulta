package com.example.realestate.controller;

import com.example.realestate.dto.PropertyRequest;
import com.example.realestate.dto.PropertyResponse;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.service.PropertyService;
import com.example.realestate.service.UserService;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/properties")
@Validated
public class PropertyController {
    private final PropertyService propertyService;
    private final UserService userService;

    public PropertyController(PropertyService propertyService, UserService userService) {
        this.propertyService = propertyService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Page<PropertyResponse>> list(
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "minPrice", required = false) @DecimalMin("0.0") BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) @DecimalMin("0.0") BigDecimal maxPrice,
            @RequestParam(name = "minBedrooms", required = false) @PositiveOrZero Integer minBedrooms,
            @RequestParam(name = "query", required = false) String query,
            @RequestParam(name = "page", defaultValue = "0") @PositiveOrZero int page,
            @RequestParam(name = "size", defaultValue = "10") @Positive int size,
            @RequestParam(name = "sort", defaultValue = "id") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by(sort));
        Page<Property> properties = propertyService.search(type, minPrice, maxPrice, minBedrooms, query, pageable);
        Page<PropertyResponse> response = properties.map(this::toResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/manage")
    public ResponseEntity<Page<PropertyResponse>> managed(Authentication authentication,
                                                          @RequestParam(name = "page", defaultValue = "0") int page,
                                                          @RequestParam(name = "size", defaultValue = "20") int size) {
        User user = getAuthenticatedUser(authentication);
        boolean admin = hasRole(authentication, Role.ROLE_ADMIN.name());
        if (!admin && !hasRole(authentication, Role.ROLE_AGENT.name())) {
            return ResponseEntity.status(403).build();
        }

        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());
        Page<PropertyResponse> response = propertyService.findManaged(user, admin, pageable).map(this::toResponse);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> get(@PathVariable("id") Long id) {
        return propertyService.findById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (!hasRole(authentication, Role.ROLE_AGENT.name()) && !hasRole(authentication, Role.ROLE_ADMIN.name())) {
            return ResponseEntity.status(403).build();
        }
        Property property = propertyService.create(request, user);
        return ResponseEntity.ok(toResponse(property));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> update(@PathVariable("id") Long id, @Valid @RequestBody PropertyRequest request, Authentication authentication) {
        Optional<Property> existing = propertyService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Property property = existing.get();
        if (!canManage(authentication, property)) {
            return ResponseEntity.status(403).build();
        }
        Property updated = propertyService.update(property, request);
        return ResponseEntity.ok(toResponse(updated));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<PropertyResponse> toggleActive(@PathVariable("id") Long id,
                                                         @RequestParam(name = "active") boolean active,
                                                         Authentication authentication) {
        Optional<Property> existing = propertyService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Property property = existing.get();
        if (!canManage(authentication, property)) {
            return ResponseEntity.status(403).build();
        }
        Property updated = propertyService.setActive(property, active);
        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id, Authentication authentication) {
        Optional<Property> existing = propertyService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Property property = existing.get();
        if (!canManage(authentication, property)) {
            return ResponseEntity.status(403).build();
        }

        propertyService.delete(property);
        return ResponseEntity.noContent().build();
    }

    private PropertyResponse toResponse(Property property) {
        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getType(),
                property.getEnterpriseCondition() == null || property.getEnterpriseCondition().isBlank() ? "PRONTO" : property.getEnterpriseCondition(),
                property.getPrice(),
                property.getBedrooms(),
            property.getBathrooms(),
            property.getSuites(),
            property.getParkingSpaces(),
            property.getTotalArea(),
            property.getPrivateArea(),
            property.getAddress(),
            property.getBrokerName() != null && !property.getBrokerName().isBlank()
                ? property.getBrokerName()
                : (property.getOwner() != null ? property.getOwner().getEmail() : null),
            new ArrayList<>(property.getImageUrls()),
                property.isActive(),
                property.getOwner() != null ? property.getOwner().getId() : null,
                property.getOwner() != null ? property.getOwner().getEmail() : null
        );
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));
    }

    private boolean canManage(Authentication authentication, Property property) {
        if (hasRole(authentication, Role.ROLE_ADMIN.name())) {
            return true;
        }
        if (hasRole(authentication, Role.ROLE_AGENT.name())) {
            return property.getOwner() != null && property.getOwner().getEmail().equals(authentication.getName());
        }
        return false;
    }
}
