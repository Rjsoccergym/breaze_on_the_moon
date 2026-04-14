package com.auth.org.application.service;

import com.auth.org.domain.entity.Persona;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generarToken(Persona persona) {
        Map<String, Object> extraClaims = new HashMap<>();
        // Inyectamos el ROL para que el Gateway y otros micros lo lean
        extraClaims.put("rol", persona.getRol().name());
        extraClaims.put("nombre", persona.getNombre());
        extraClaims.put("userId", persona.getId().toString());

        return Jwts.builder()
                .claims(extraClaims)
                .subject(persona.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
