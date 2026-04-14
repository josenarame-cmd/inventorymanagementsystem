package com.jose.group.inventorymanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "customers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Integer version;

    @Column(nullable = false)
    private String name;

    private String email;
    private String phone;
    private String address;

    @Builder.Default
    private BigDecimal totalSales = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalReceived = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO; // Amount receivable
}
