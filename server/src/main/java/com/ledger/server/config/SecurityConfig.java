package com.ledger.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Registers the custom security filter chain bean in the Spring application context
    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disables CSRF protection since this REST API uses stateless requests and testing endpoints
                .csrf(csrf -> csrf.disable())

                // Defines path-level authorization rules for incoming HTTP requests
                .authorizeHttpRequests(auth ->

                        // Allows public, unauthenticated access to all endpoints under /api/v1/
                        auth.requestMatchers("/api/v1/**").permitAll()
                                // Requires authentication for any other endpoint not explicitly permitted
                                .anyRequest().authenticated()
                );
        return http.build();
    }

}
