package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.entity.SalesOrder;
import com.jose.group.inventorymanagementsystem.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService service;

    @GetMapping
    public ResponseEntity<List<SalesOrder>> getAllSalesOrders() {
        return ResponseEntity.ok(service.getAllSalesOrders());
    }

    @PostMapping
    public ResponseEntity<SalesOrder> createSalesOrder(@RequestBody SalesOrder order) {
        return ResponseEntity.ok(service.createSalesOrder(order));
    }

    /** Admin endpoint to recalculate grandTotal for orders that were saved as 0 */
    @PostMapping("/repair")
    public ResponseEntity<String> repairZeroTotals() {
        int count = service.repairZeroTotals();
        return ResponseEntity.ok("Repaired " + count + " sales order(s) with zero grand total.");
    }
}
