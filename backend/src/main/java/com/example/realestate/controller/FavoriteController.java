package com.example.realestate.controller;

import com.example.realestate.dto.PropertyResponse;
import com.example.realestate.entity.Favorite;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import com.example.realestate.service.FavoriteService;
import com.example.realestate.service.PropertyService;
import com.example.realestate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;
    private final PropertyService propertyService;
    private final UserService userService;

    public FavoriteController(FavoriteService favoriteService, PropertyService propertyService, UserService userService) {
        this.favoriteService = favoriteService;
        this.propertyService = propertyService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> list(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<PropertyResponse> response = favoriteService.listFavorites(user).stream()
                .map(Favorite::getProperty)
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{propertyId}")
    public ResponseEntity<Void> add(@PathVariable("propertyId") Long propertyId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Property property = propertyService.findById(propertyId).orElseThrow();
        favoriteService.addFavorite(user, property);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> remove(@PathVariable("propertyId") Long propertyId, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Property property = propertyService.findById(propertyId).orElseThrow();
        favoriteService.removeFavorite(user, property);
        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName()).orElseThrow();
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
}
