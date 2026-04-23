package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.Customer;
import com.jose.group.inventorymanagementsystem.entity.Product;
import com.jose.group.inventorymanagementsystem.entity.SalesItem;
import com.jose.group.inventorymanagementsystem.entity.SalesOrder;
import com.jose.group.inventorymanagementsystem.repository.CustomerRepository;
import com.jose.group.inventorymanagementsystem.repository.ProductRepository;
import com.jose.group.inventorymanagementsystem.repository.SalesOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public SalesOrder createSalesOrder(SalesOrder order) {
        // Validate that items are present
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException("Sales order must contain at least one item.");
        }
        Customer customer = customerRepository.findById(order.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        order.setCustomer(customer);
        
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("COMPLETED");

        BigDecimal total = BigDecimal.ZERO;
        for (SalesItem item : order.getItems()) {
            // Fetch and set real Product
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProduct().getId()));
            
            if (product.getRemainingQty() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            item.setProduct(product);
            if (item.getUnitPrice() == null) {
                item.setUnitPrice(product.getSellingPrice());
            }
            item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            total = total.add(item.getTotalPrice());

            // Update Stock by adding to qtySold
            product.setQtySold(product.getQtySold() + item.getQuantity());
            productRepository.save(product);

            // Link item to order
            item.setSalesOrder(order);
        }

        order.setTotalAmount(total);
        order.setTaxAmount(total.multiply(new BigDecimal("0.1")));
        order.setGrandTotal(order.getTotalAmount().add(order.getTaxAmount()));

        // Update Customer Balance
        customer.setTotalSales(customer.getTotalSales().add(order.getGrandTotal()));
        customer.setBalance(customer.getBalance().add(order.getGrandTotal()));
        customerRepository.save(customer);

        SalesOrder saved = salesOrderRepository.save(order);
        auditLogService.log("CREATE", "SalesOrder", saved.getId(), "Created sales order: " + saved.getOrderNumber());
        return saved;
    }

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    /**
     * Repairs existing sales orders where grandTotal = 0 but items exist.
     * Recalculates totals from the persisted sales_items rows.
     */
    @Transactional
    public int repairZeroTotals() {
        List<SalesOrder> orders = salesOrderRepository.findAll();
        int repaired = 0;
        for (SalesOrder order : orders) {
            boolean hasZeroTotal = order.getGrandTotal() == null || order.getGrandTotal().compareTo(BigDecimal.ZERO) == 0;
            if (hasZeroTotal && order.getItems() != null && !order.getItems().isEmpty()) {
                BigDecimal total = BigDecimal.ZERO;
                for (SalesItem item : order.getItems()) {
                    boolean hasZeroPrice = item.getUnitPrice() == null || item.getUnitPrice().compareTo(BigDecimal.ZERO) == 0;
                    if (hasZeroPrice && item.getProduct() != null) {
                        item.setUnitPrice(item.getProduct().getSellingPrice());
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
                    salesOrderRepository.save(order);
                    repaired++;
                }
            }
        }
        return repaired;
    }
}
