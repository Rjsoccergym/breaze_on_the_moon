package service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CodificadorAdapter implements ICodificador {

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