package com.auth.org.application.service;

import com.auth.org.application.port.ICodificadorPort;
import com.auth.org.application.port.IEventPublisherPort;
import com.auth.org.domain.entity.Administrador;
import com.auth.org.domain.entity.Cliente;
import com.auth.org.domain.exception.InvalidCredentialsException;
import com.auth.org.domain.exception.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import com.auth.org.application.dto.AuthResponseDTO;
import com.auth.org.application.dto.RegisterRequestDTO;
import com.auth.org.application.dto.LoginRequestDTO;
import com.auth.org.domain.entity.Persona;
import com.auth.org.domain.enums.Rol;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.auth.org.domain.repository.IPersonaRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final IPersonaRepository personaRepository;
    private final ICodificadorPort codificador;
    private final JwtService jwtService;
    private final IEventPublisherPort eventPublisher;

    @Transactional(readOnly = true)
    public AuthResponseDTO iniciarSesion(LoginRequestDTO request) {
        Persona persona = personaRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        if (!codificador.comparar(request.getPassword(), persona.getPassword())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generarToken(persona);

        // Notificación asíncrona a la Lambda
        eventPublisher.notificarEvento("LOGIN", "Usuario " + persona.getUsername() + " accedió.");

        return AuthResponseDTO.builder()
                .token(token)
                .username(persona.getUsername())
                .rol(persona.getRol().name())
                .mensaje("Bienvenido " + persona.getNombre())
                .build();
    }

    @Transactional
    public void registrarUsuario(RegisterRequestDTO request) {
        registrarUsuario(request, Rol.CLIENT);
    }

    @Transactional
    public void registrarAdministrador(RegisterRequestDTO request) {
        registrarUsuario(request, Rol.ADMIN);
    }

    private void registrarUsuario(RegisterRequestDTO request, Rol rol) {
        if (personaRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("El nombre de usuario ya existe");
        }

        Persona persona = (rol.equals(Rol.CLIENT)) ? new Cliente() : new Administrador();
        persona.setUsername(request.getUsername());
        persona.setEmail(request.getEmail());
        persona.setNombre(request.getNombre());
        persona.setApellido(request.getApellido());
        persona.setPassword(codificador.codificar(request.getPassword()));
        persona.setRol(rol);

        personaRepository.save(persona);
        eventPublisher.notificarEvento("REGISTER", "Nuevo usuario: " + persona.getUsername());
    }
}
