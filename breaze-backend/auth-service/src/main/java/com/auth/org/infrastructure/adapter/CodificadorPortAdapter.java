package com.auth.org.infrastructure.adapter;

import com.auth.org.application.port.ICodificadorPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CodificadorPortAdapter implements ICodificadorPort {

    private final PasswordEncoder passwordEncoder;

    @Override
    public String codificar(String plainText) {
        return passwordEncoder.encode(plainText);
    }

    @Override
    public boolean comparar(String plainText, String hashedText) {
        return passwordEncoder.matches(plainText, hashedText);
    }
}