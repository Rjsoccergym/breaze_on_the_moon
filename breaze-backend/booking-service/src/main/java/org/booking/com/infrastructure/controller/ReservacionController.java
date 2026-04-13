package org.booking.com.infrastructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.booking.com.application.dto.ReservacionRequestDTO;
import org.booking.com.application.dto.ReservacionResponseDTO;
import org.booking.com.domain.enums.EstadoReserva;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.booking.com.application.service.ReservacionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class ReservacionController {

    private static final String USER_ID_HEADER = "X-Authenticated-User-Id";

    private final ReservacionService reservacionService;

    // POST / - Crear una nueva reserva (Cualquier usuario autenticado)
    @PostMapping
    public ResponseEntity<ReservacionResponseDTO> crearReservacion(
            @Valid @RequestBody ReservacionRequestDTO dto,
            @RequestHeader(value = USER_ID_HEADER, required = false) String authenticatedUserId,
            Authentication authentication) {
        return new ResponseEntity<>(
                reservacionService.crearReservacion(dto, parseUuid(authenticatedUserId), hasRole(authentication, "ADMIN")),
                HttpStatus.CREATED
        );
    }

    // PATCH /{id}/confirmar - Confirmar una reserva (Lógica del negocio)
    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> confirmarReservacion(@PathVariable UUID id) {
        reservacionService.confirmarReservacion(id);
        return ResponseEntity.ok().build();
    }

    // GET / - Listar reservas por estado (Para el Administrador)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservacionResponseDTO>> listarPorEstado(@RequestParam EstadoReserva estado) {
        return ResponseEntity.ok(reservacionService.findByEstado(estado));
    }

    // GET /cliente/{clienteId} - Ver historial de un cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<ReservacionResponseDTO>> listarPorCliente(
            @PathVariable UUID clienteId,
            @RequestHeader(value = USER_ID_HEADER, required = false) String authenticatedUserId,
            Authentication authentication) {
        return ResponseEntity.ok(reservacionService.findByClienteId(
                clienteId,
                parseUuid(authenticatedUserId),
                hasRole(authentication, "ADMIN")
        ));
    }

    // DELETE /{id} - Cancelar reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarReservacion(
            @PathVariable UUID id,
            @RequestHeader(value = USER_ID_HEADER, required = false) String authenticatedUserId,
            Authentication authentication) {
        reservacionService.cancelarReservacion(id, parseUuid(authenticatedUserId), hasRole(authentication, "ADMIN"));
        return ResponseEntity.noContent().build();
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication != null && authentication.getAuthorities() != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> ("ROLE_" + role).equalsIgnoreCase(authority.getAuthority()));
    }

    private UUID parseUuid(String value) {
        return value == null || value.isBlank() ? null : UUID.fromString(value);
    }
}
