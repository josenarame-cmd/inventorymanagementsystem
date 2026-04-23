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
                log.info("Executing database migration to update roles...");
                jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;");
                
                // Update legacy roles to new schema
                jdbcTemplate.execute("UPDATE users SET role = 'OPERATIONS_STAFF' WHERE role = 'STAFF' OR role = 'OPERATIONS';");
                jdbcTemplate.execute("UPDATE users SET role = 'FINANCE_ACCOUNTANT' WHERE role = 'FINANCE';");
                jdbcTemplate.execute("UPDATE users SET role = 'MANAGER_SUPERVISOR' WHERE role = 'MANAGER';");
                
                // Ensure enabled column exists and is populated
                try {
                    jdbcTemplate.execute("ALTER TABLE users ADD COLUMN enabled BOOLEAN DEFAULT TRUE;");
                } catch (Exception e) { /* Column might already exist */ }
                jdbcTemplate.execute("UPDATE users SET enabled = TRUE WHERE enabled IS NULL;");
                jdbcTemplate.execute("UPDATE users SET enabled = TRUE WHERE username = 'admin';");
                
                log.info("Database migration and role mapping completed successfully.");
            } catch (Exception e) {
                log.error("Migration skipped or failed: {}", e.getMessage());
            }
        };
    }
}
