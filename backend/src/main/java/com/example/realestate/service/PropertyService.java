package com.example.realestate.service;

import com.example.realestate.dto.PropertyRequest;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import com.example.realestate.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class PropertyService {
    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Page<Property> search(String type, BigDecimal minPrice, BigDecimal maxPrice, Integer minBedrooms, String query, Pageable pageable) {
        String normalizedType = type == null ? "" : type.trim();
        String normalizedQuery = query == null ? "" : query.trim();
        return propertyRepository.search(normalizedType, minPrice, maxPrice, minBedrooms, normalizedQuery, pageable);
    }

    public Optional<Property> findById(Long id) {
        return propertyRepository.findById(id);
    }

    public Page<Property> findManaged(User owner, boolean admin, Pageable pageable) {
        if (admin) {
            return propertyRepository.findAll(pageable);
        }
        return propertyRepository.findByOwner(owner, pageable);
    }

    private void applyRequest(Property property, PropertyRequest request) {
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setType(request.getType());
        property.setEnterpriseCondition(request.getEnterpriseCondition());
        property.setPrice(request.getPrice());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setSuites(request.getSuites());
        property.setParkingSpaces(request.getParkingSpaces());
        property.setTotalArea(request.getTotalArea());
        property.setPrivateArea(request.getPrivateArea());
        property.setAddress(request.getAddress());
        property.setBrokerName(request.getBrokerName());
        property.setImageUrls(new ArrayList<>(request.getImageUrls()));
    }

    @Transactional
    public Property create(PropertyRequest request, User owner) {
        Property property = new Property();
        applyRequest(property, request);
        property.setActive(true);
        property.setOwner(owner);
        return propertyRepository.save(property);
    }

    @Transactional
    public Property update(Property property, PropertyRequest request) {
        applyRequest(property, request);
        return propertyRepository.save(property);
    }

    @Transactional
    public Property setActive(Property property, boolean enabled) {
        property.setActive(enabled);
        return propertyRepository.save(property);
    }

    @Transactional
    public void delete(Property property) {
        propertyRepository.delete(property);
    }
}
