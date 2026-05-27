package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.OtpCode;
import com.jose.group.inventorymanagementsystem.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpCodeRepository otpCodeRepository;
    
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    /**
     * Generate a numeric OTP code for the given email and purpose
     */
    @Transactional
    public String generateOtp(String email, String purpose) {
        // Invalidate any existing OTPs for this email and purpose
        otpCodeRepository.findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            email, purpose, LocalDateTime.now()
        ).ifPresent(otp -> {
            otp.setUsed(true);
            otpCodeRepository.save(otp);
        });

        // Generate new OTP
        String otpCode = generateNumericOtp();
        
        OtpCode otp = OtpCode.builder()
                .code(otpCode)
                .email(email)
                .purpose(purpose)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .used(false)
                .attempts(0)
                .build();
        
        otpCodeRepository.save(otp);
        log.info("Generated OTP for email: {}, purpose: {}", email, purpose);
        
        return otpCode;
    }

    /**
     * Validate an OTP code
     */
    @Transactional
    public boolean validateOtp(String email, String code, String purpose) {
        LocalDateTime now = LocalDateTime.now();
        
        java.util.Optional<Boolean> result = otpCodeRepository
                .findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                    email, purpose, now
                )
                .map(otp -> {
                    if (otp.getAttempts() >= 3) {
                        log.warn("OTP validation failed for email: {} - max attempts reached", email);
                        return false;
                    }
                    
                    if (otp.getCode().equals(code)) {
                        otp.setUsed(true);
                        otpCodeRepository.save(otp);
                        log.info("OTP validated successfully for email: {}", email);
                        return true;
                    } else {
                        otp.setAttempts(otp.getAttempts() + 1);
                        otpCodeRepository.save(otp);
                        log.warn("OTP validation failed for email: {} - invalid code (attempt: {})", 
                                email, otp.getAttempts());
                        return false;
                    }
                });
        
        return result.orElse(false);
    }

    /**
     * Generate a random numeric OTP
     */
    private String generateNumericOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    /**
     * Clean up expired OTP codes (call this periodically)
     */
    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        int deleted = otpCodeRepository.deleteByExpiresAtBefore(now);
        if (deleted > 0) {
            log.info("Cleaned up {} expired OTP codes", deleted);
        }
    }
}
