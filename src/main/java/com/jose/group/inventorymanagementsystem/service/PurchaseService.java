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

    @Transactional
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
        
        for (PurchaseItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQtyPurchased(product.getQtyPurchased() - item.getQuantity());
            productRepository.save(product);
        }

        Supplier supplier = order.getSupplier();
        supplier.setTotalPurchases(supplier.getTotalPurchases().subtract(order.getGrandTotal()));
        supplier.setBalance(supplier.getBalance().subtract(order.getGrandTotal()));
        supplierRepository.save(supplier);

        purchaseOrderRepository.delete(order);
        auditLogService.log("DELETE", "PurchaseOrder", id, "Deleted purchase order: " + order.getOrderNumber());
    }

    @Transactional
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder updatedOrder) {
        PurchaseOrder existing = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
        
        // 1. Revert existing order impacts
        for (PurchaseItem item : existing.getItems()) {
            Product product = item.getProduct();
            product.setQtyPurchased(product.getQtyPurchased() - item.getQuantity());
            productRepository.save(product);
        }
        Supplier oldSupplier = existing.getSupplier();
        oldSupplier.setTotalPurchases(oldSupplier.getTotalPurchases().subtract(existing.getGrandTotal()));
        oldSupplier.setBalance(oldSupplier.getBalance().subtract(existing.getGrandTotal()));
        supplierRepository.save(oldSupplier);

        // 2. Clear old items
        existing.getItems().clear();

        // 3. Apply new order details
        if (updatedOrder.getItems() == null || updatedOrder.getItems().isEmpty()) {
            throw new RuntimeException("Purchase order must contain at least one item.");
        }
        Supplier newSupplier = supplierRepository.findById(updatedOrder.getSupplier().getId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        existing.setSupplier(newSupplier);

        BigDecimal total = BigDecimal.ZERO;
        for (PurchaseItem item : updatedOrder.getItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));
            
            item.setProduct(product);
            if (item.getUnitPrice() == null) {
                item.setUnitPrice(product.getPurchasePrice());
            }
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            total = total.add(item.getTotalPrice());

            product.setQtyPurchased(product.getQtyPurchased() + item.getQuantity());
            productRepository.save(product);

            item.setPurchaseOrder(existing);
            existing.getItems().add(item);
        }

        existing.setTotalAmount(total);
        existing.setTaxAmount(total.multiply(new BigDecimal("0.1")));
        existing.setGrandTotal(existing.getTotalAmount().add(existing.getTaxAmount()));

        newSupplier.setTotalPurchases(newSupplier.getTotalPurchases().add(existing.getGrandTotal()));
        newSupplier.setBalance(newSupplier.getBalance().add(existing.getGrandTotal()));
        supplierRepository.save(newSupplier);

        PurchaseOrder saved = purchaseOrderRepository.save(existing);
        auditLogService.log("UPDATE", "PurchaseOrder", saved.getId(), "Updated purchase order: " + saved.getOrderNumber());
        return saved;
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
