package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.dto.AuthenticationRequest;
import com.jose.group.inventorymanagementsystem.dto.AuthenticationResponse;
import com.jose.group.inventorymanagementsystem.dto.OtpRequest;
import com.jose.group.inventorymanagementsystem.dto.OtpValidationRequest;
import com.jose.group.inventorymanagementsystem.dto.RegisterRequest;
import com.jose.group.inventorymanagementsystem.service.AuthService;
import com.jose.group.inventorymanagementsystem.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService service;
    private final OtpService otpService;

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

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody OtpRequest request) {
        log.info("CONTROLLER: Received OTP request for email: {}, purpose: {}", request.getEmail(), request.getPurpose());
        String otp = otpService.generateOtp(request.getEmail(), request.getPurpose());
        
        // In production, you would send this via email/SMS
        // For now, return it in the response (for testing)
        return ResponseEntity.ok(Map.of(
            "message", "OTP sent successfully",
            "otp", otp, // Remove this in production!
            "expiresIn", "5 minutes"
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody OtpValidationRequest request) {
        log.info("CONTROLLER: Received OTP verification for email: {}", request.getEmail());
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getCode(), request.getPurpose());
        
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }
    }
}
