package com.room.org.infrastructure.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class RequestIdentityFilter extends OncePerRequestFilter {

    private static final String USER_HEADER = "X-Authenticated-User";
    private static final String ROLE_HEADER = "X-Authenticated-Role";
    private static final String INTERNAL_SERVICE_HEADER = "X-Internal-Service";

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String internalService = request.getHeader(INTERNAL_SERVICE_HEADER);
            String username = request.getHeader(USER_HEADER);
            String role = request.getHeader(ROLE_HEADER);

            if (StringUtils.hasText(internalService)) {
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                        internalService,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_SERVICE"))
                ));
            } else if (StringUtils.hasText(username) && StringUtils.hasText(role)) {
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                ));
            }
        }

        filterChain.doFilter(request, response);
    }
}
