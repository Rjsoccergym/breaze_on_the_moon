package controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import model.dtos.ReservacionRequestDTO;
import model.dtos.ReservacionResponseDTO;
import model.entity.Reservacion;
import model.enums.EstadoReserva;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import service.ReservacionService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class ReservacionController {

    private final ReservacionService reservacionService;

    // POST / - Crear una nueva reserva (Cualquier usuario autenticado)
    @PostMapping
    public ResponseEntity<ReservacionResponseDTO> crearReservacion(
            @Valid @RequestBody ReservacionRequestDTO dto) {
        return new ResponseEntity<>(reservacionService.crearReservacion(dto), HttpStatus.CREATED);
    }

    // PATCH /{id}/confirmar - Confirmar una reserva (Lógica del negocio)
    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Void> confirmarReservacion(@PathVariable UUID id) {
        reservacionService.confirmarReservacion(id);
        return ResponseEntity.ok().build();
    }

    // GET / - Listar reservas por estado (Para el Administrador)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Reservacion>> listarPorEstado(
            @RequestParam EstadoReserva estado) {
        return ResponseEntity.ok(reservacionService.findByEstado(estado));
    }

    // GET /cliente/{clienteId} - Ver historial de un cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Reservacion>> listarPorCliente(@PathVariable UUID clienteId) {
        return ResponseEntity.ok(reservacionService.findByClienteId(clienteId));
    }

    // DELETE /{id} - Cancelar reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarReservacion(@PathVariable UUID id) {
        reservacionService.cancelarReservacion(id);
        return ResponseEntity.noContent().build();
    }
}
