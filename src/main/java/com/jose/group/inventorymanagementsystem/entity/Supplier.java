package com.jose.group.inventorymanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "suppliers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Integer version;

    @Column(nullable = false)
    private String name;

    private String contactPerson;
    private String email;
    private String phone;
    private String address;

    @Builder.Default
    private BigDecimal totalPurchases = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal totalPaid = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO; // Outstanding payable
}
