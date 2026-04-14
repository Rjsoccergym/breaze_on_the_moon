package com.room.org.infrastructure.controller;

import com.room.org.application.dto.CambiarEstadoHabitacionRequest;
import com.room.org.application.dto.HabitacionRequestDTO;
import com.room.org.application.dto.HabitacionResponseDTO;
import com.room.org.application.service.HabitacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/room")
@RequiredArgsConstructor
public class HabitacionController {

    private final HabitacionService habitacionService;

    @GetMapping
    public ResponseEntity<List<HabitacionResponseDTO>> consultarHabitaciones(
            @RequestParam(value = "status", required = false) String status,
            Authentication authentication) {
        boolean puedeVerInventarioCompleto = hasAnyRole(authentication, "ADMIN", "SERVICE");
        return ResponseEntity.ok(habitacionService.listarHabitaciones(status, puedeVerInventarioCompleto));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HabitacionResponseDTO> registrarHabitacion(@Valid @RequestBody HabitacionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(habitacionService.crearHabitacion(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HabitacionResponseDTO> actualizarHabitacion(
            @PathVariable UUID id,
            @Valid @RequestBody HabitacionRequestDTO dto) {
        return ResponseEntity.ok(habitacionService.actualizarHabitacion(id, dto));
    }

    @PatchMapping({"/{id}/status", "/{id}/estado"})
    @PreAuthorize("hasAnyRole('ADMIN','SERVICE')")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambiarEstadoHabitacionRequest body) {
        habitacionService.cambiarEstado(id, body.getStatus());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitacionResponseDTO> obtenerPorId(
            @PathVariable UUID id,
            Authentication authentication) {
        boolean puedeVerInventarioCompleto = hasAnyRole(authentication, "ADMIN", "SERVICE");
        return ResponseEntity.ok(habitacionService.obtenerHabitacionVisible(id, puedeVerInventarioCompleto));
    }

    @GetMapping({"/{id}/availability", "/{id}/disponibilidad"})
    public ResponseEntity<Map<String, Boolean>> verificarDisponibilidad(@PathVariable UUID id) {
        return ResponseEntity.ok(Map.of("available", habitacionService.estaDisponible(id)));
    }

    private boolean hasAnyRole(Authentication authentication, String... roles) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }

        for (String role : roles) {
            boolean hasRole = authentication.getAuthorities().stream()
                    .anyMatch(authority -> ("ROLE_" + role).equalsIgnoreCase(authority.getAuthority()));
            if (hasRole) {
                return true;
            }
        }
        return false;
    }
}
