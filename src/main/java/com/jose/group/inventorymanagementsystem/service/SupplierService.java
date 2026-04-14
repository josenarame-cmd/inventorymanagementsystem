package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.Supplier;
import com.jose.group.inventorymanagementsystem.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository repository;

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    public Supplier createSupplier(Supplier supplier) {
        return repository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier details) {
        Supplier supplier = getSupplierById(id);
        supplier.setName(details.getName());
        supplier.setContactPerson(details.getContactPerson());
        supplier.setEmail(details.getEmail());
        supplier.setPhone(details.getPhone());
        supplier.setAddress(details.getAddress());
        return repository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        // Prevent deletion if supplier has outstanding balance (as per requirements)
        Supplier supplier = getSupplierById(id);
        if (supplier.getBalance().compareTo(java.math.BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Cannot delete supplier with outstanding balance");
        }
        repository.deleteById(id);
    }
}
