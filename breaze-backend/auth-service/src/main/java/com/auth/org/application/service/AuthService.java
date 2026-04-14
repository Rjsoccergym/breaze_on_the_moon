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
        try {
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
                    .userId(persona.getId())
                    .username(persona.getUsername())
                    .nombre(persona.getNombre())
                    .apellido(persona.getApellido())
                    .email(persona.getEmail())
                    .rol(persona.getRol() != null ? persona.getRol().name() : "CLIENT")
                    .tipoIdentificacion(persona.getTipoIdentificacion())
                    .numeroIdentificacion(persona.getNumeroIdentificacion())
                    .telefono(persona.getTelefono())
                    .fechaNacimiento(persona.getFechaNacimiento())
                    .mensaje("Bienvenido " + persona.getNombre())
                    .build();
        } catch (InvalidCredentialsException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("[DEBUG] Error en iniciarSesion: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error procesando login: " + e.getMessage(), e);
        }
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
        if (personaRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("El correo electrónico ya está registrado");
        }
        if (request.getNumeroIdentificacion() != null
                && !request.getNumeroIdentificacion().isBlank()
                && personaRepository.findByNumeroIdentificacion(request.getNumeroIdentificacion().trim()).isPresent()) {
            throw new UserAlreadyExistsException("El número de identificación ya está registrado");
        }

        Persona persona = (rol.equals(Rol.CLIENT)) ? new Cliente() : new Administrador();
        persona.setUsername(request.getUsername().trim());
        persona.setEmail(request.getEmail().trim());
        persona.setNombre(request.getNombre().trim());
        persona.setApellido(request.getApellido().trim());
        persona.setPassword(codificador.codificar(request.getPassword()));
        persona.setTipoIdentificacion(request.getTipoIdentificacion());
        persona.setNumeroIdentificacion(normalize(request.getNumeroIdentificacion()));
        persona.setTelefono(normalize(request.getTelefono()));
        persona.setFechaNacimiento(request.getFechaNacimiento());
        persona.setRol(rol);

        personaRepository.save(persona);
        eventPublisher.notificarEvento("REGISTER", "Nuevo usuario: " + persona.getUsername());
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
