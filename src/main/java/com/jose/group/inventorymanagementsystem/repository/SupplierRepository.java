package com.jose.group.inventorymanagementsystem.repository;

import com.jose.group.inventorymanagementsystem.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
