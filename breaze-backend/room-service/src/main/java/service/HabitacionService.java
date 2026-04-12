package service;

import exception.HabitacionNotFoundException;
import lombok.RequiredArgsConstructor;
import model.dtos.HabitacionRequestDTO;
import model.entity.Habitacion;
import model.enums.EstadoHabitacion;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.IHabitacionRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HabitacionService {

    private final IHabitacionRepository habitacionRepository;
    private final IEventPublisher eventPublisher;

    @Transactional
    public Habitacion crearHabitacion(HabitacionRequestDTO dto) {
        Habitacion nueva = new Habitacion();
        nueva.setNumeroIdentificador(dto.getNumeroIdentificador());
        nueva.setTipo(dto.getTipo());
        nueva.setDescripcion(dto.getDescripcion());
        nueva.setCapacidadMaxima(dto.getCapacidadMaxima());
        nueva.setPrecioNoche(dto.getPrecioNoche());
        nueva.setEstado(EstadoHabitacion.DISPONIBLE); // Estado inicial por defecto

        Habitacion guardada = habitacionRepository.save(nueva);

        // Notificar evento según tu diagrama (Caja naranja -> Lambda)
        eventPublisher.notificarEvento("HABITACION_CREADA", guardada.getId().toString());

        return guardada;
    }

    @Transactional(readOnly = true)
    public List<Habitacion> listarHabitacionesDisponibles() {
        return habitacionRepository.findByEstado(EstadoHabitacion.DISPONIBLE);
    }

    @Transactional(readOnly = true)
    public Habitacion obtenerHabitacionPorId(UUID id) {
        return habitacionRepository.findById(id)
                .orElseThrow(() -> new HabitacionNotFoundException("Habitación no encontrada con ID: " + id));
    }

    @Transactional
    public void cambiarEstado(UUID id, EstadoHabitacion nuevoEstado) {
        Habitacion habitacion = obtenerHabitacionPorId(id);
        habitacion.setEstado(nuevoEstado);
        habitacionRepository.save(habitacion);

        eventPublisher.notificarEvento("ESTADO_CAMBIADO", id.toString());
    }

    // Método solicitado en tu diagrama: verificarPermisos(Rol)
    public boolean verificarPermisos(String rol) {
        return "ADMIN".equalsIgnoreCase(rol);
    }
}
