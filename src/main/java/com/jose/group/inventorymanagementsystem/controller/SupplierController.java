package com.jose.group.inventorymanagementsystem.controller;

import com.jose.group.inventorymanagementsystem.entity.Supplier;
import com.jose.group.inventorymanagementsystem.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService service;

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(service.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSupplierById(id));
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(service.createSupplier(supplier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        return ResponseEntity.ok(service.updateSupplier(id, supplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        service.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
