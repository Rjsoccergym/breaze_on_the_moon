package com.room.org.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/v1/room/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/room/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/room/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/room/*/status", "/api/v1/room/*/estado").hasAnyRole("ADMIN", "SERVICE")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new RequestIdentityFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
