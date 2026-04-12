package service;

import exception.InvalidCredentialsException;
import exception.UserAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import model.dto.AuthResponseDTO;
import model.dto.RegisterRequestDTO;
import model.dto.LoginRequestDTO;
import model.entity.ERol;
import model.entity.Persona;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.IPersonaRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final IPersonaRepository personaRepository;
    private final ICodificador codificador;
    private final JwtService jwtService;
    private final IEventPublisher eventPublisher;

    /**
     * Lógica de inicio de sesión basada en el diagrama de clases.
     * Utiliza findByUsername y el método comparar de ICodificador.
     */
    @Transactional(readOnly = true)
    public AuthResponseDTO iniciarSesion(LoginRequestDTO request) {
        // 1. Buscar usuario por username
        Persona persona = personaRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        // 2. Validar contraseña usando la interfaz del diagrama
        if (!codificador.comparar(request.getPassword(), persona.getPassword())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        // 3. Generar el Token JWT
        String token = jwtService.generarToken(persona);

        // Notificación de Auditoría
        eventPublisher.notificarEvento("LOGIN", 
            String.format("Usuario %s inició sesión con rol %s", persona.getUsername(), persona.getRol()));
        
        log.info("Usuario {} ha iniciado sesión exitosamente", persona.getUsername());

        // 4. Retornar respuesta mapeada al DTO
        return AuthResponseDTO.builder()
                .token(token)
                .username(persona.getUsername())
                .rol(persona.getRol().name())
                .mensaje("Inicio de sesión exitoso")
                .build();
    }

    /**
     * Lógica de registro de usuario.
     * Utiliza el método codificar de ICodificador antes de persistir.
     */
    @Transactional
    public void registrarUsuario(RegisterRequestDTO request) {
        // Validar si el usuario o email ya existen
        if (personaRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("El nombre de usuario ya está en uso");
        }

        if (personaRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("El correo electrónico ya está registrado");
        }

        // Mapeo manual (o usar MapStruct) para asegurar que el ROL sea CLIENT por defecto
        Persona persona = new Persona();
        persona.setUsername(request.getUsername());
        persona.setEmail(request.getEmail());
        persona.setNombre(request.getNombreCompleto()); // Corregido: Mapear el nombre para el JWT
        persona.setRol(ERol.CLIENT); // Por defecto se registran como CLIENT
        
        // Codificar contraseña
        persona.setPassword(codificador.codificar(request.getPassword()));

        personaRepository.save(persona);
        
        // Notificación de Auditoría
        eventPublisher.notificarEvento("USER_REGISTERED", 
            String.format("Nuevo usuario registrado: %s", persona.getUsername()));
            
        log.info("Nuevo usuario registrado: {} con rol {}", persona.getUsername(), persona.getRol());
    }
}
