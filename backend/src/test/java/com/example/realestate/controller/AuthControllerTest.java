package com.example.realestate.controller;

import com.example.realestate.dto.AuthRequest;
import com.example.realestate.dto.AuthResponse;
import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.security.JwtTokenProvider;
import com.example.realestate.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    @Test
    void loginShouldReturnTokenWhenCredentialsAreValid() {
        AuthRequest request = new AuthRequest();
        request.setEmail("admin@example.com");
        request.setPassword("password123");

        User user = new User("admin@example.com", "encoded", Set.of(Role.ROLE_ADMIN));
        when(userService.findByEmail("admin@example.com")).thenReturn(java.util.Optional.of(user));
        when(tokenProvider.createToken("admin@example.com", Set.of("ROLE_ADMIN"))).thenReturn("jwt-token");

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("jwt-token", response.getBody().getToken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginShouldReturnUnauthorizedWhenCredentialsAreInvalid() {
        AuthRequest request = new AuthRequest();
        request.setEmail("admin@example.com");
        request.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Credenciais inválidas"));

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNull(response.getBody());
        verify(tokenProvider, never()).createToken(any(), any());
    }

    @Test
    void registerShouldReturnTokenForNewUser() {
        AuthRequest request = new AuthRequest();
        request.setEmail("client@example.com");
        request.setPassword("password123");

        User user = new User("client@example.com", "encoded", Set.of(Role.ROLE_CLIENT));
        when(userService.registerClient("client@example.com", "password123")).thenReturn(user);
        when(tokenProvider.createToken("client@example.com", Set.of("ROLE_CLIENT"))).thenReturn("register-token");

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("register-token", response.getBody().getToken());
    }
}
