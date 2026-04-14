package com.jose.group.inventorymanagementsystem.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner migrateEnum() {
        return args -> {
            try {
                log.info("Executing database migration to update ENUM constraints...");
                jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;");
                log.info("Database migration completed successfully.");
            } catch (Exception e) {
                log.error("Migration skipped or failed: {}", e.getMessage());
            }
        };
    }
}
