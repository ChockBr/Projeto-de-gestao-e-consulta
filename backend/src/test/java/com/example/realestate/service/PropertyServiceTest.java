package com.example.realestate.service;

import com.example.realestate.dto.PropertyRequest;
import com.example.realestate.entity.Property;
import com.example.realestate.entity.User;
import com.example.realestate.repository.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PropertyService propertyService;

    @Test
    void searchShouldNormalizeTypeAndQueryBeforeCallingRepository() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Property> page = new PageImpl<>(List.of());
        when(propertyRepository.search("APARTMENT", null, null, null, "centro", pageable)).thenReturn(page);

        propertyService.search("  APARTMENT  ", null, null, null, "  centro  ", pageable);

        verify(propertyRepository).search("APARTMENT", null, null, null, "centro", pageable);
    }

    @Test
    void findManagedShouldReturnAllForAdmin() {
        User owner = new User();
        Pageable pageable = PageRequest.of(0, 20);
        Page<Property> page = new PageImpl<>(List.of());
        when(propertyRepository.findAll(pageable)).thenReturn(page);

        propertyService.findManaged(owner, true, pageable);

        verify(propertyRepository).findAll(pageable);
    }

    @Test
    void findManagedShouldReturnOwnerPropertiesForAgent() {
        User owner = new User();
        Pageable pageable = PageRequest.of(0, 20);
        Page<Property> page = new PageImpl<>(List.of());
        when(propertyRepository.findByOwner(owner, pageable)).thenReturn(page);

        propertyService.findManaged(owner, false, pageable);

        verify(propertyRepository).findByOwner(owner, pageable);
    }

    @Test
    void createShouldSetOwnerActivateAndMapRequestFields() {
        PropertyRequest request = buildRequest();
        User owner = new User();
        owner.setEmail("agent@example.com");

        when(propertyRepository.save(org.mockito.ArgumentMatchers.any(Property.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Property created = propertyService.create(request, owner);

        ArgumentCaptor<Property> captor = ArgumentCaptor.forClass(Property.class);
        verify(propertyRepository).save(captor.capture());
        Property saved = captor.getValue();

        assertEquals("Apartamento no centro", saved.getTitle());
        assertEquals("PRONTO", saved.getEnterpriseCondition());
        assertEquals(owner, saved.getOwner());
        assertTrue(saved.isActive());
        assertEquals(2, saved.getImageUrls().size());
        assertNotSame(request.getImageUrls(), saved.getImageUrls());

        assertEquals(saved.getTitle(), created.getTitle());
    }

    private PropertyRequest buildRequest() {
        PropertyRequest request = new PropertyRequest();
        request.setTitle("Apartamento no centro");
        request.setDescription("Imóvel amplo");
        request.setType("APARTMENT");
        request.setEnterpriseCondition("PRONTO");
        request.setPrice(new BigDecimal("450000.00"));
        request.setBedrooms(3);
        request.setBathrooms(2);
        request.setSuites(1);
        request.setParkingSpaces(1);
        request.setTotalArea(new BigDecimal("120"));
        request.setPrivateArea(new BigDecimal("100"));
        request.setAddress("Rua A, 100 - Centro");
        request.setBrokerName("Corretor Teste");
        request.setImageUrls(List.of("https://img/1.jpg", "https://img/2.jpg"));
        return request;
    }
}
