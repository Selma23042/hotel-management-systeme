package com.hotel.customer_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Routes publiques pour authentification
                .requestMatchers("/api/customers/register", "/api/customers/login").permitAll()
                
                // Routes pour les appels inter-services (IMPORTANT !)
                // Permettre GET /api/customers/{id} pour que le Booking Service puisse récupérer les infos
                .requestMatchers("GET", "/api/customers/**").permitAll()
                
                // Actuator endpoints
                .requestMatchers("/actuator/**").permitAll()
                
                // Toutes les autres routes nécessitent une authentification
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
}