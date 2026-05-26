package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.entity.PurchaseOrder;
import com.jose.group.inventorymanagementsystem.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService service;

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        return ResponseEntity.ok(service.getAllPurchaseOrders());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder order) {
        return ResponseEntity.ok(service.createPurchaseOrder(order));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(@PathVariable Long id, @RequestBody PurchaseOrder order) {
        return ResponseEntity.ok(service.updatePurchaseOrder(id, order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        service.deletePurchaseOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/repair")
    public ResponseEntity<String> repairZeroTotals() {
        int count = service.repairZeroTotals();
        return ResponseEntity.ok("Repaired " + count + " purchase order(s) with zero grand total.");
    }
}
