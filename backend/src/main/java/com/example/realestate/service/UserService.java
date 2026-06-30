package com.example.realestate.service;

import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerClient(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        User user = new User(email, passwordEncoder.encode(password), Collections.singleton(Role.ROLE_CLIENT));
        return userRepository.save(user);
    }

    @Transactional
    public User createUser(String email, String password, Set<Role> roles) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        User user = new User(email, passwordEncoder.encode(password), roles);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
