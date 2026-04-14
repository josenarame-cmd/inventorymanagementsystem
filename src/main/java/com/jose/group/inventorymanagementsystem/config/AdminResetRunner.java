package com.jose.group.inventorymanagementsystem.config;

import com.jose.group.inventorymanagementsystem.entity.User;
import com.jose.group.inventorymanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminResetRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        String targetUsername = "admin";
        String targetEmail = "vizionbot@gmail.com";
        String targetPassword = "Vizionbot@1";
        
        // Find existing admin or the 'vizionbot' username I created earlier
        userRepository.findByUsername(targetUsername)
            .or(() -> userRepository.findByUsername("vizionbot"))
            .ifPresentOrElse(
                user -> {
                    user.setUsername(targetUsername); // Always ensure it's 'admin' for your login habit
                    user.setEmail(targetEmail);
                    user.setPassword(passwordEncoder.encode(targetPassword));
                    user.setFullName("Vizion Bot Administrator");
                    user.setRole(User.Role.ADMIN);
                    userRepository.save(user);
                    log.info("========== ADMIN ACCOUNT READY: {} / {} ==========", targetUsername, targetPassword);
                },
                () -> {
                    User admin = User.builder()
                            .username(targetUsername)
                            .password(passwordEncoder.encode(targetPassword))
                            .email(targetEmail)
                            .fullName("Vizion Bot Administrator")
                            .role(User.Role.ADMIN)
                            .build();
                    userRepository.save(admin);
                    log.info("========== ADMIN ACCOUNT CREATED: {} / {} ==========", targetUsername, targetPassword);
                }
            );
        log.info("AdminResetRunner: Professional identity verified. You can login with 'admin' or '{}'", targetEmail);
    }
}
