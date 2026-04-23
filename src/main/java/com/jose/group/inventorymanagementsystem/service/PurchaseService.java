package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.Product;
import com.jose.group.inventorymanagementsystem.entity.PurchaseItem;
import com.jose.group.inventorymanagementsystem.entity.PurchaseOrder;
import com.jose.group.inventorymanagementsystem.entity.Supplier;
import com.jose.group.inventorymanagementsystem.repository.ProductRepository;
import com.jose.group.inventorymanagementsystem.repository.PurchaseOrderRepository;
import com.jose.group.inventorymanagementsystem.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder order) {
        // Validate that items are present
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException("Purchase order must contain at least one item.");
        }
        // Fetch and set real Supplier
        Supplier supplier = supplierRepository.findById(order.getSupplier().getId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        order.setSupplier(supplier);

        order.setOrderDate(LocalDateTime.now());
        order.setStatus("RECEIVED");

        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseItem item : order.getItems()) {
            // Fetch and set real Product
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));
            
            item.setProduct(product);
            // Use the unit price from the request, fallback to product purchase price if not provided
            if (item.getUnitPrice() == null) {
                item.setUnitPrice(product.getPurchasePrice());
            }
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            total = total.add(item.getTotalPrice());

            // Update Stock by adding to qtyPurchased
            product.setQtyPurchased(product.getQtyPurchased() + item.getQuantity());
            productRepository.save(product);

            // Link item to order
            item.setPurchaseOrder(order);
        }

        order.setTotalAmount(total);
        order.setTaxAmount(total.multiply(new BigDecimal("0.1")));
        order.setGrandTotal(order.getTotalAmount().add(order.getTaxAmount()));

        // Update Supplier Balance
        supplier.setTotalPurchases(supplier.getTotalPurchases().add(order.getGrandTotal()));
        supplier.setBalance(supplier.getBalance().add(order.getGrandTotal()));
        supplierRepository.save(supplier);

        PurchaseOrder saved = purchaseOrderRepository.save(order);
        auditLogService.log("CREATE", "PurchaseOrder", saved.getId(), "Created purchase order: " + saved.getOrderNumber());
        return saved;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    /**
     * Repairs existing purchase orders where grandTotal = 0 but items exist.
     */
    @Transactional
    public int repairZeroTotals() {
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
        int repaired = 0;
        for (PurchaseOrder order : orders) {
            boolean hasZeroTotal = order.getGrandTotal() == null || order.getGrandTotal().compareTo(BigDecimal.ZERO) == 0;
            if (hasZeroTotal && order.getItems() != null && !order.getItems().isEmpty()) {
                BigDecimal total = BigDecimal.ZERO;
                for (PurchaseItem item : order.getItems()) {
                    boolean hasZeroPrice = item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) == 0;
                    if (hasZeroPrice && item.getProduct() != null) {
                        item.setUnitPrice(item.getProduct().getPurchasePrice());
                    }
                    if (item.getUnitPrice() != null && item.getQuantity() != null) {
                        BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                        item.setTotalPrice(lineTotal);
                        total = total.add(lineTotal);
                    }
                }
                if (total.compareTo(BigDecimal.ZERO) > 0) {
                    order.setTotalAmount(total);
                    order.setTaxAmount(total.multiply(new BigDecimal("0.1")));
                    order.setGrandTotal(order.getTotalAmount().add(order.getTaxAmount()));
                    purchaseOrderRepository.save(order);
                    repaired++;
                }
            }
        }
        return repaired;
    }
}
