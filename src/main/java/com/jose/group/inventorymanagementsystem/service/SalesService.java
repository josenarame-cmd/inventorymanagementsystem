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
        // Fetch and set real Customer
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
}
