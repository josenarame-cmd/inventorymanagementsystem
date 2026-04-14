package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.dto.AuthenticationRequest;
import com.jose.group.inventorymanagementsystem.dto.AuthenticationResponse;
import com.jose.group.inventorymanagementsystem.dto.RegisterRequest;
import com.jose.group.inventorymanagementsystem.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService service;

    @PostMapping(value = "/register", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthenticationResponse> register(
            @ModelAttribute RegisterRequest request
    ) {
        log.info("CONTROLLER: Received registration request for user: {}", request.getUsername());
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        log.info("CONTROLLER: Received login request for user: {}", request.getUsername());
        return ResponseEntity.ok(service.authenticate(request));
    }
}
