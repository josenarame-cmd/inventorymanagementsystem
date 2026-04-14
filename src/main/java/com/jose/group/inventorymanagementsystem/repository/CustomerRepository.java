package com.jose.group.inventorymanagementsystem.repository;

import com.jose.group.inventorymanagementsystem.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
