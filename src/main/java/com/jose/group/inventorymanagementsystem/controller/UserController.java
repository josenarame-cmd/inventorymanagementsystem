package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.dto.UserDto;
import com.jose.group.inventorymanagementsystem.entity.User;
import com.jose.group.inventorymanagementsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.createUser(body));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable Long id, @RequestParam User.Role role) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
