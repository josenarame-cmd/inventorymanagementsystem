package com.jose.group.inventorymanagementsystem.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Prevents Render free-tier from putting the service to sleep.
 * Pings the app's own health endpoint every 14 minutes.
 * Set RENDER_EXTERNAL_URL env variable on Render to your app's public URL.
 * Example: https://your-app-name.onrender.com
 */
@Slf4j
@Component
@EnableScheduling
public class KeepAliveScheduler {

    @Value("${RENDER_EXTERNAL_URL:}")
    private String renderExternalUrl;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // Runs every 14 minutes (840,000 ms) — Render sleeps after 15 min inactivity
    @Scheduled(fixedRate = 840000, initialDelay = 60000)
    public void keepAlive() {
        if (renderExternalUrl == null || renderExternalUrl.isBlank()) {
            // Not running on Render or URL not configured — skip silently
            return;
        }

        String healthUrl = renderExternalUrl.replaceAll("/$", "") + "/api/v1/public/health";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(healthUrl))
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("[KeepAlive] Self-ping OK — status: {} | url: {}", response.statusCode(), healthUrl);
        } catch (Exception e) {
            log.warn("[KeepAlive] Self-ping failed: {} | url: {}", e.getMessage(), healthUrl);
        }
    }
}
