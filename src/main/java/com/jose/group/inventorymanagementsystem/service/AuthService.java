package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.dto.AuthenticationRequest;
import com.jose.group.inventorymanagementsystem.dto.AuthenticationResponse;
import com.jose.group.inventorymanagementsystem.dto.RegisterRequest;
import com.jose.group.inventorymanagementsystem.entity.User;
import com.jose.group.inventorymanagementsystem.repository.UserRepository;
import com.jose.group.inventorymanagementsystem.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        String profilePictureUrl = null;
        if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
            try {
                String fileName = java.util.UUID.randomUUID().toString() + "_" + request.getProfilePicture().getOriginalFilename();
                java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads/profiles");
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Path filePath = uploadPath.resolve(fileName);
                java.nio.file.Files.copy(request.getProfilePicture().getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                profilePictureUrl = "/uploads/profiles/" + fileName;
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to store profile picture", e);
            }
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.OPERATIONS_STAFF)
                .profilePictureUrl(profilePictureUrl)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Attempting authentication for user: {}", request.getUsername());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            log.info("Authentication manager successful for user: {}", request.getUsername());
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.error("Authentication failed for user: {}. Error: {}", request.getUsername(), e.getMessage());
            // Check if user even exists to distinguish UserNotFound from BadCredentials in logs
            repository.findByUsername(request.getUsername()).ifPresentOrElse(
                u -> log.warn("User {} exists but provided WRONG password.", request.getUsername()),
                () -> log.warn("User {} NOT FOUND in database.", request.getUsername())
            );
            throw e;
        }
        var user = repository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> {
                    log.error("User {} not found AFTER successful authentication (unexpected!)", request.getUsername());
                    return new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found after auth");
                });
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .role(user.getRole().name())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }
}
