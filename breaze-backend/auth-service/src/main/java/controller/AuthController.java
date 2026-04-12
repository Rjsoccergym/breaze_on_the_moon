package controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import model.dto.AuthResponseDTO;
import model.dto.LoginRequestDTO;
import model.dto.RegisterRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService autenticacionService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> iniciarSesion(
            @Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(autenticacionService.iniciarSesion(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrar(@Valid @RequestBody RegisterRequestDTO request) {
        autenticacionService.registrarUsuario(request);
        return new ResponseEntity<>("Usuario registrado exitosamente", HttpStatus.CREATED);
    }

    // El diagrama sugiere otros verbos como GET o PATCH (quizás para perfil de usuario)
    @GetMapping("/perfil/{id}")
    public ResponseEntity<String> obtenerPerfil(@PathVariable String id) {
        // Implementación futura según lógica de negocio
        return ResponseEntity.ok("Perfil del usuario: " + id);
    }
}
