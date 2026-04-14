package com.jose.group.inventorymanagementsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Integer version;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal purchasePrice;

    @Column(nullable = false)
    private BigDecimal sellingPrice;

    private String itemType;
    private String category;
    private String subcategory;

    @Builder.Default
    private Integer qtyPurchased = 0;

    @Builder.Default
    private Integer qtyManufactured = 0;

    @Builder.Default
    private Integer qtySold = 0;

    @Builder.Default
    private Integer qtyUsed = 0;

    @Builder.Default
    private Integer reorderLevel = 10;

    private String unit; // e.g., kg, unit, box

    public Integer getRemainingQty() {
        int purchased = qtyPurchased != null ? qtyPurchased : 0;
        int manufactured = qtyManufactured != null ? qtyManufactured : 0;
        int sold = qtySold != null ? qtySold : 0;
        int used = qtyUsed != null ? qtyUsed : 0;
        return (purchased + manufactured) - (sold + used);
    }
}
