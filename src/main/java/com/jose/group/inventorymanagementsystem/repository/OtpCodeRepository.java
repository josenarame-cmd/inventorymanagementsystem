package com.jose.group.inventorymanagementsystem.repository;

import com.jose.group.inventorymanagementsystem.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    
    Optional<OtpCode> findTopByEmailAndPurposeAndUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
        String email, 
        String purpose, 
        LocalDateTime expiresAt
    );
    
    @Modifying
    @Transactional
    @Query("DELETE FROM OtpCode o WHERE o.expiresAt < :dateTime")
    int deleteByExpiresAtBefore(LocalDateTime dateTime);
}
