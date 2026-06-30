package com.example.realestate.config;

import com.example.realestate.entity.Role;
import com.example.realestate.entity.User;
import com.example.realestate.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DemoDataSeeder {

    @Bean
    CommandLineRunner seedDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createOrUpdateDemoUser(userRepository, passwordEncoder, "admin@example.com", "password123", Set.of(Role.ROLE_ADMIN));
            createOrUpdateDemoUser(userRepository, passwordEncoder, "agent@example.com", "password123", Set.of(Role.ROLE_AGENT));
        };
    }

    private void createOrUpdateDemoUser(UserRepository userRepository,
                                        PasswordEncoder passwordEncoder,
                                        String email,
                                        String rawPassword,
                                        Set<Role> roles) {
        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            existing.setPassword(passwordEncoder.encode(rawPassword));
            existing.setRoles(roles);
            userRepository.save(existing);
            return;
        }

        User user = new User(email, passwordEncoder.encode(rawPassword), roles);
        userRepository.save(user);
    }
}
