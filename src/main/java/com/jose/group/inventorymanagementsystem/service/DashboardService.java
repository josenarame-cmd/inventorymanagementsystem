package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalProducts", productRepository.count());
        stats.put("totalSuppliers", supplierRepository.count());
        stats.put("totalCustomers", customerRepository.count());
        
        // Low stock products
        stats.put("lowStockCount", productRepository.findAll().stream()
                .filter(p -> p.getRemainingQty() <= p.getReorderLevel())
                .count());

        // Simple revenue calculation (sum of all completed sales)
        stats.put("totalSalesAmount", salesOrderRepository.findAll().stream()
                .map(so -> so.getGrandTotal())
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));

        stats.put("totalPurchaseAmount", purchaseOrderRepository.findAll().stream()
                .map(po -> po.getGrandTotal())
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));

        return stats;
    }
}
