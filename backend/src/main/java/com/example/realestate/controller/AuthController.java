package com.example.realestate.controller;

import com.example.realestate.dto.AuthRequest;
import com.example.realestate.dto.AuthResponse;
import com.example.realestate.entity.User;
import com.example.realestate.security.JwtTokenProvider;
import com.example.realestate.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        User user = userService.registerClient(request.getEmail(), request.getPassword());
        String token = tokenProvider.createToken(user.getEmail(), user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            User user = userService.findByEmail(request.getEmail()).orElseThrow();
            String token = tokenProvider.createToken(user.getEmail(), user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }
}
