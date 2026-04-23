package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.dto.UserDto;
import com.jose.group.inventorymanagementsystem.entity.User;
import com.jose.group.inventorymanagementsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserDto getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public UserDto updateProfile(String username, Map<String, String> body) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("password") && !body.get("password").isEmpty()) {
            user.setPassword(passwordEncoder.encode(body.get("password")));
        }
        
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto createUser(Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");
        String fullName = body.get("fullName");
        String password = body.get("password");
        String roleName = body.get("role");

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(roleName);
        } catch (Exception e) {
            role = User.Role.OPERATIONS_STAFF;
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .fullName(fullName)
                .password(passwordEncoder.encode(password))
                .role(role)
                .build();

        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUserRole(Long userId, User.Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
             throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .enabled(user.isEnabled())
                .build();
    }
}
