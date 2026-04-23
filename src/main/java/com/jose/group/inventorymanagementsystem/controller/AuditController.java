package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.entity.AuditLog;
import com.jose.group.inventorymanagementsystem.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        // Return logs sorted by timestamp descending
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }
}
