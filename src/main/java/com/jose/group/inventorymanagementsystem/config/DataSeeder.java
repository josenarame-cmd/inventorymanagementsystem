package com.jose.group.inventorymanagementsystem.config;

import com.jose.group.inventorymanagementsystem.entity.Customer;
import com.jose.group.inventorymanagementsystem.entity.Product;
import com.jose.group.inventorymanagementsystem.entity.Supplier;
import com.jose.group.inventorymanagementsystem.repository.CustomerRepository;
import com.jose.group.inventorymanagementsystem.repository.ProductRepository;
import com.jose.group.inventorymanagementsystem.repository.SupplierRepository;
import com.jose.group.inventorymanagementsystem.service.PurchaseService;
import com.jose.group.inventorymanagementsystem.service.SalesService;
import com.jose.group.inventorymanagementsystem.entity.SalesOrder;
import com.jose.group.inventorymanagementsystem.entity.SalesItem;
import com.jose.group.inventorymanagementsystem.entity.PurchaseOrder;
import com.jose.group.inventorymanagementsystem.entity.PurchaseItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final SalesService salesService;
    private final PurchaseService purchaseService;

    @Override
    public void run(String... args) throws Exception {
        seedSuppliers();
        seedProducts();
        seedCustomers();
        seedPurchases();
        seedSales();
    }

    private void seedSuppliers() {
        if (supplierRepository.count() > 0) {
            log.info("Suppliers already seeded, skipping.");
            return;
        }
        supplierRepository.saveAll(List.of(
            buildSupplier("Global Tech Solutions", "Sarah Smith", "orders@globaltech.com", "9876543210", "12 Tech Park, New York, NY"),
            buildSupplier("TechParts Global", "Alice Monroe", "alice@techpartsglobal.com", "+1-555-0101", "14 Industrial Park, New York, NY"),
            buildSupplier("FreshGoods Co.", "Brian Lee", "brian@freshgoods.com", "+1-555-0102", "88 Market Street, Los Angeles, CA"),
            buildSupplier("OfficeSupply Hub", "Carol Singh", "carol@officesupplyhub.com", "+1-555-0103", "44 Commerce Ave, Chicago, IL"),
            buildSupplier("ElectroPro Ltd", "David Kim", "david@electropro.com", "+1-555-0104", "7 Silicon Blvd, San Jose, CA")
        ));
        log.info("✅ Seeded 5 suppliers.");
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            log.info("Products already seeded, skipping.");
            return;
        }
        productRepository.saveAll(List.of(
            buildProduct("IPH-15P-256",  "iPhone 15 Pro",            "Latest Apple flagship smartphone, 256GB",          "899.00",  "1099.99", 50,  10, "unit"),
            buildProduct("MAC-AIR-M2",   "MacBook Air M2",           "Apple MacBook Air with M2 chip, 8GB RAM, 256GB SSD","799.00",  "999.99",  20,  5,  "unit"),
            buildProduct("SKU-LAPTOP-01","Laptop Pro 15\"",           "High-performance business laptop 16GB/512GB SSD",  "750.00",  "1199.99", 25,  5,  "unit"),
            buildProduct("SKU-MOUSE-01", "Wireless Ergonomic Mouse", "Comfortable wireless mouse, long battery life",     "12.00",   "29.99",   120, 20, "unit"),
            buildProduct("SKU-KBRD-01",  "Mechanical Keyboard",      "Tactile keyboard with RGB backlighting",            "45.00",   "89.99",   60,  10, "unit"),
            buildProduct("SKU-MON-01",   "27\" 4K Monitor",           "Ultra-crisp 4K IPS monitor with HDR support",      "280.00",  "449.99",  15,  5,  "unit"),
            buildProduct("SKU-HDMI-01",  "HDMI 2.1 Cable 2m",        "High-speed HDMI cable supporting 8K/60Hz",         "4.50",    "14.99",   200, 30, "unit"),
            buildProduct("SKU-WEBCAM-01","HD Webcam 1080p",          "Full HD webcam with built-in mic and auto-focus",  "28.00",   "59.99",   45,  10, "unit"),
            buildProduct("SKU-PAPER-01", "A4 Printer Paper (Ream)",  "500 sheets of high-quality 80gsm A4 paper",        "3.50",    "7.99",    500, 50, "ream"),
            buildProduct("SKU-CHAIR-01", "Ergonomic Office Chair",   "Adjustable lumbar support chair for long sessions", "180.00",  "349.99",  10,  3,  "unit")
        ));
        log.info("✅ Seeded 10 products.");
    }

    private void seedCustomers() {
        if (customerRepository.count() > 0) {
            log.info("Customers already seeded, skipping.");
            return;
        }
        customerRepository.saveAll(List.of(
            buildCustomer("John Doe",          "john@example.com",         "1234567890",   "123 Main St, Springfield"),
            buildCustomer("Acme Corporation",  "procurement@acme.com",     "+1-555-1001",  "100 Acme Blvd, Phoenix, AZ"),
            buildCustomer("Globex Industries", "orders@globex.com",        "+1-555-1002",  "200 Industry Way, Springfield, IL"),
            buildCustomer("Initech Solutions", "purchasing@initech.com",   "+1-555-1003",  "300 Tech Park, Austin, TX"),
            buildCustomer("Stark Enterprises", "supply@stark.com",         "+1-555-1004",  "10880 Malibu Point, Malibu, CA"),
            buildCustomer("Wayne Technologies","orders@waynetech.com",     "+1-555-1005",  "1007 Mountain Drive, Gotham, NJ")
        ));
        log.info("✅ Seeded 6 customers.");
    }

    private void seedPurchases() {
        if (purchaseService.getAllPurchaseOrders().size() > 0) return;
        List<Product> products = productRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();
        if (products.isEmpty() || suppliers.isEmpty()) return;

        PurchaseOrder po = new PurchaseOrder();
        po.setOrderNumber("PO-00001");
        po.setSupplier(suppliers.get(0));
        PurchaseItem pi = new PurchaseItem();
        pi.setProduct(products.get(0));
        pi.setQuantity(20);
        po.getItems().add(pi);
        purchaseService.createPurchaseOrder(po);
        log.info("✅ Seeded initial purchases.");
    }

    private void seedSales() {
        if (salesService.getAllSalesOrders().size() > 0) return;
        List<Product> products = productRepository.findAll();
        List<Customer> customers = customerRepository.findAll();
        if (products.isEmpty() || customers.isEmpty()) return;

        SalesOrder so = new SalesOrder();
        so.setOrderNumber("SO-00001");
        so.setCustomer(customers.get(0));
        SalesItem si = new SalesItem();
        si.setProduct(products.get(1));
        si.setQuantity(2);
        so.getItems().add(si);
        salesService.createSalesOrder(so);
        log.info("✅ Seeded initial sales.");
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private Supplier buildSupplier(String name, String contact, String email, String phone, String address) {
        Supplier s = new Supplier();
        s.setName(name);
        s.setContactPerson(contact);
        s.setEmail(email);
        s.setPhone(phone);
        s.setAddress(address);
        s.setBalance(BigDecimal.ZERO);
        s.setTotalPurchases(BigDecimal.ZERO);
        s.setTotalPaid(BigDecimal.ZERO);
        return s;
    }

    private Product buildProduct(String sku, String name, String desc,
                                  String purchasePrice, String sellingPrice,
                                  int stock, int reorder, String unit) {
        Product p = new Product();
        p.setSku(sku);
        p.setName(name);
        p.setDescription(desc);
        p.setPurchasePrice(new BigDecimal(purchasePrice));
        p.setSellingPrice(new BigDecimal(sellingPrice));
        p.setQtyPurchased(stock);
        p.setReorderLevel(reorder);
        p.setUnit(unit);
        return p;
    }

    private Customer buildCustomer(String name, String email, String phone, String address) {
        Customer c = new Customer();
        c.setName(name);
        c.setEmail(email);
        c.setPhone(phone);
        c.setAddress(address);
        c.setBalance(BigDecimal.ZERO);
        c.setTotalSales(BigDecimal.ZERO);
        c.setTotalReceived(BigDecimal.ZERO);
        return c;
    }
}
