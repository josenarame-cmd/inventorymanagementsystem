package com.jose.group.inventorymanagementsystem.service;

import com.jose.group.inventorymanagementsystem.entity.Customer;
import com.jose.group.inventorymanagementsystem.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer createCustomer(Customer customer) {
        return repository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer details) {
        Customer customer = getCustomerById(id);
        customer.setName(details.getName());
        customer.setEmail(details.getEmail());
        customer.setPhone(details.getPhone());
        customer.setAddress(details.getAddress());
        return repository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        if (customer.getBalance().compareTo(java.math.BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Cannot delete customer with outstanding balance");
        }
        repository.deleteById(id);
    }
}
