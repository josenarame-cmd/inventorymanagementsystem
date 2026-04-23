package com.jose.group.inventorymanagementsystem.config;

import com.jose.group.inventorymanagementsystem.service.SalesService;
import com.jose.group.inventorymanagementsystem.service.PurchaseService;
import com.jose.group.inventorymanagementsystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataRepairRunner implements CommandLineRunner {

    private final SalesService salesService;
    private final PurchaseService purchaseService;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("DataRepairRunner: Starting data consistency check...");
        
        // Fix product 4 if it has 0 selling price (known issue)
        productRepository.findById(4L).ifPresent(p -> {
            if (p.getSellingPrice() == null || p.getSellingPrice().compareTo(BigDecimal.ZERO) == 0) {
                p.setSellingPrice(new BigDecimal("150000.00"));
                productRepository.save(p);
                log.info("DataRepairRunner: Fixed zero selling price for product: {}", p.getName());
            }
        });

        int salesRepaired = salesService.repairZeroTotals();
        if (salesRepaired > 0) {
            log.info("DataRepairRunner: Fixed {} sales invoices with zero grand total.", salesRepaired);
        }

        int purchasesRepaired = purchaseService.repairZeroTotals();
        if (purchasesRepaired > 0) {
            log.info("DataRepairRunner: Fixed {} purchase orders with zero grand total.", purchasesRepaired);
        }

        log.info("DataRepairRunner: Data consistency check completed.");
    }
}
