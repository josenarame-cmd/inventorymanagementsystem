package com.jose.group.inventorymanagementsystem.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SpaWebFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request, 
                                    @org.springframework.lang.NonNull HttpServletResponse response, 
                                    @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        
        // If the request is not for API and doesn't have an extension (like .js, .css, .png)
        // then forward it to index.html to allow React Router to handle it.
        if (!path.startsWith("/api") && !path.startsWith("/h2-console") && !path.contains(".") && path.matches("/.*")) {
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
