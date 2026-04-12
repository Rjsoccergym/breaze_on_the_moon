package config;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import service.ICodificador;

@Component
@RequiredArgsConstructor
public class BCryptCodificadorAdapter implements ICodificador {

    private final PasswordEncoder passwordEncoder;

    @Override
    public String codificar(String password) {
        return passwordEncoder.encode(password);
    }

    @Override
    public boolean comparar(String passwordPlano, String passwordCodificado) {
        return passwordEncoder.matches(passwordPlano, passwordCodificado);
    }
}
