package com.jose.group.inventorymanagementsystem.repository;

import com.jose.group.inventorymanagementsystem.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
}
