package com.jose.group.inventorymanagementsystem.repository;

import com.jose.group.inventorymanagementsystem.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);
    List<AuditLog> findByEntityNameOrderByTimestampDesc(String entityName);
}
