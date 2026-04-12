package controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import model.dtos.HabitacionRequestDTO;
import model.entity.Habitacion;
import model.enums.EstadoHabitacion;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import service.HabitacionService;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class HabitacionController {

    private final HabitacionService habitacionService;

    // GET / - Consultar habitaciones disponibles
    @GetMapping
    public ResponseEntity<List<Habitacion>> consultarHabitaciones() {
        return ResponseEntity.ok(habitacionService.listarHabitacionesDisponibles());
    }

    // POST / - Registrar habitación (Solo ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Habitacion> registrarHabitacion(@Valid @RequestBody HabitacionRequestDTO dto) {
        Habitacion nueva = habitacionService.crearHabitacion(dto);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    // PATCH /{id}/status - Cambiar estado (Solo ADMIN)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {

        EstadoHabitacion nuevoEstado = EstadoHabitacion.valueOf(body.get("status").toUpperCase());
        habitacionService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok().build();
    }

    // GET /{id} - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(habitacionService.obtenerHabitacionPorId(id));
    }
}
