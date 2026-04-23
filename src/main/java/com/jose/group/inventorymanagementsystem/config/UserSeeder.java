package com.jose.group.inventorymanagementsystem.config;

import com.jose.group.inventorymanagementsystem.entity.User;
import com.jose.group.inventorymanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(3)
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUser("manager", "Manager User", User.Role.MANAGER_SUPERVISOR);
        seedUser("staff", "Staff User", User.Role.OPERATIONS_STAFF);
        seedUser("finance", "Finance User", User.Role.FINANCE_ACCOUNTANT);
    }

    private void seedUser(String username, String fullName, User.Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode("password123"))
                    .email(username + "@vizion.com")
                    .fullName(fullName)
                    .role(role)
                    .enabled(true)
                    .build();
            userRepository.save(user);
            log.info("✅ Seeded {} account: {}", role, username);
        }
    }
}
