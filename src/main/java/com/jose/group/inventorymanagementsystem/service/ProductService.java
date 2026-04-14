package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.Product;
import com.jose.group.inventorymanagementsystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final AuditLogService auditLogService;

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product getProductById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product createProduct(Product product) {
        Product saved = repository.save(product);
        auditLogService.log("CREATE", "Product", saved.getId(), "Created product: " + saved.getName());
        return saved;
    }

    public Product updateProduct(Long id, Product details) {
        Product product = getProductById(id);
        product.setName(details.getName());
        product.setDescription(details.getDescription());
        product.setSku(details.getSku());
        product.setPurchasePrice(details.getPurchasePrice());
        product.setSellingPrice(details.getSellingPrice());
        product.setReorderLevel(details.getReorderLevel());
        product.setUnit(details.getUnit());
        product.setItemType(details.getItemType());
        product.setCategory(details.getCategory());
        product.setSubcategory(details.getSubcategory());
        product.setQtyPurchased(details.getQtyPurchased());
        product.setQtyManufactured(details.getQtyManufactured());
        product.setQtySold(details.getQtySold());
        product.setQtyUsed(details.getQtyUsed());
        return repository.save(product);
    }

    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}
