package com.auth.org.infrastructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.auth.org.application.dto.AuthResponseDTO;
import com.auth.org.application.dto.LoginRequestDTO;
import com.auth.org.application.dto.RegisterRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.auth.org.application.service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService autenticacionService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> iniciarSesion(
            @Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(autenticacionService.iniciarSesion(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registrar(@Valid @RequestBody RegisterRequestDTO request) {
        autenticacionService.registrarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Usuario registrado exitosamente"));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<Map<String, String>> registrarAdmin(@Valid @RequestBody RegisterRequestDTO request) {
        autenticacionService.registrarAdministrador(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Administrador registrado exitosamente"));
    }
}
