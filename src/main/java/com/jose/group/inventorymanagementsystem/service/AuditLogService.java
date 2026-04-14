package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.AuditLog;
import com.jose.group.inventorymanagementsystem.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository repository;

    public void log(String action, String entityName, Long entityId, String details) {
        String username = "SYSTEM";
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            username = auth.getName();
        }
        
        AuditLog auditLog = AuditLog.builder()
                .username(username)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        repository.save(auditLog);
    }
}
