package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.entity.AuditLog;
import com.jose.group.inventorymanagementsystem.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class AuditLogController {
    private final AuditLogRepository repository;

    @GetMapping
    public List<AuditLog> getAllLogs() {
        return repository.findAll();
    }

    @GetMapping("/user")
    public List<AuditLog> getLogsByUser(@RequestParam String username) {
        return repository.findByUsernameOrderByTimestampDesc(username);
    }
}
