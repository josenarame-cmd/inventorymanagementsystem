package com.jose.group.inventorymanagementsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.jose.group.inventorymanagementsystem.entity.User;
import com.jose.group.inventorymanagementsystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class InventoryManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryManagementSystemApplication.class, args);
    }
}
