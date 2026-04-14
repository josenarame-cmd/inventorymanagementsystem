package com.jose.group.inventorymanagementsystem.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Integer version;

    @Column(unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    private LocalDateTime orderDate;

    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal grandTotal = BigDecimal.ZERO;

    private String status; // PENDING, RECEIVED, CANCELLED

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<PurchaseItem> items = new ArrayList<>();
}
