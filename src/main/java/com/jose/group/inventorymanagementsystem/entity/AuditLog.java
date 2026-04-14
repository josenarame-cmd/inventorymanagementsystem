package com.jose.group.inventorymanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String entityName;

    private Long entityId;

    @Column(length = 2000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
