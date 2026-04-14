package com.jose.group.inventorymanagementsystem.repository;

import com.jose.group.inventorymanagementsystem.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
}
