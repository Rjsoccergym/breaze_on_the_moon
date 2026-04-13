package com.room.org.application.service;

import com.room.org.application.dto.HabitacionRequestDTO;
import com.room.org.application.dto.HabitacionResponseDTO;
import com.room.org.application.port.IEventPublisherPort;
import com.room.org.domain.entity.Habitacion;
import com.room.org.domain.enums.EstadoHabitacion;
import com.room.org.domain.exception.HabitacionNotFoundException;
import com.room.org.domain.exception.UnauthorizedActionException;
import com.room.org.domain.repository.IHabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HabitacionService {

    private static final String MENSAJE_HABITACION_NO_ENCONTRADA = "Habitación no encontrada con ID: ";

    private final IHabitacionRepository habitacionRepository;
    private final IEventPublisherPort eventPublisher;

    @Transactional
    public HabitacionResponseDTO crearHabitacion(HabitacionRequestDTO dto) {
        validarNumeroIdentificadorDisponible(dto.getNumeroIdentificador(), null);

        Habitacion nueva = new Habitacion();
        nueva.setNumeroIdentificador(dto.getNumeroIdentificador().trim());
        nueva.setTipo(dto.getTipo());
        nueva.setDescripcion(dto.getDescripcion());
        nueva.setCapacidadMaxima(dto.getCapacidadMaxima());
        nueva.setPrecioNoche(dto.getPrecioNoche());
        nueva.setEstado(EstadoHabitacion.DISPONIBLE);

        Habitacion guardada = habitacionRepository.save(nueva);
        eventPublisher.notificarEvento("HABITACION_CREADA", guardada.getNumeroIdentificador());
        return mapToResponse(guardada);
    }

    @Transactional(readOnly = true)
    public List<HabitacionResponseDTO> listarHabitaciones(String estado, boolean puedeVerInventarioCompleto) {
        if (estado == null || estado.isBlank()) {
            return (puedeVerInventarioCompleto ? habitacionRepository.findAll() : habitacionRepository.findByEstado(EstadoHabitacion.DISPONIBLE))
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        EstadoHabitacion estadoHabitacion = parseEstado(estado);
        if (!puedeVerInventarioCompleto && estadoHabitacion != EstadoHabitacion.DISPONIBLE) {
            throw new UnauthorizedActionException("Solo los administradores pueden consultar habitaciones en estado " + estado);
        }

        return habitacionRepository.findByEstado(estadoHabitacion).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HabitacionResponseDTO obtenerHabitacionPorId(UUID id) {
        return mapToResponse(buscarHabitacion(id));
    }

    @Transactional(readOnly = true)
    public HabitacionResponseDTO obtenerHabitacionVisible(UUID id, boolean puedeVerInventarioCompleto) {
        Habitacion habitacion = buscarHabitacion(id);
        if (!puedeVerInventarioCompleto && habitacion.getEstado() != EstadoHabitacion.DISPONIBLE) {
            throw new UnauthorizedActionException("Solo se pueden consultar habitaciones disponibles");
        }
        return mapToResponse(habitacion);
    }

    @Transactional(readOnly = true)
    public boolean estaDisponible(UUID id) {
        Habitacion habitacion = buscarHabitacion(id);
        return habitacion.getEstado() == EstadoHabitacion.DISPONIBLE;
    }

    @Transactional
    public HabitacionResponseDTO actualizarHabitacion(UUID id, HabitacionRequestDTO dto) {
        Habitacion habitacion = buscarHabitacion(id);
        validarNumeroIdentificadorDisponible(dto.getNumeroIdentificador(), id);

        habitacion.setNumeroIdentificador(dto.getNumeroIdentificador().trim());
        habitacion.setTipo(dto.getTipo());
        habitacion.setDescripcion(dto.getDescripcion());
        habitacion.setCapacidadMaxima(dto.getCapacidadMaxima());
        habitacion.setPrecioNoche(dto.getPrecioNoche());

        Habitacion guardada = habitacionRepository.save(habitacion);
        eventPublisher.notificarEvento("HABITACION_ACTUALIZADA", guardada.getNumeroIdentificador());
        return mapToResponse(guardada);
    }

    @Transactional
    public void cambiarEstado(UUID id, EstadoHabitacion nuevoEstado) {
        Habitacion habitacion = buscarHabitacion(id);
        habitacion.setEstado(nuevoEstado);
        habitacionRepository.save(habitacion);
        eventPublisher.notificarEvento("ESTADO_CAMBIADO", habitacion.getNumeroIdentificador());
    }

    private Habitacion buscarHabitacion(UUID id) {
        return habitacionRepository.findById(id)
                .orElseThrow(() -> new HabitacionNotFoundException(MENSAJE_HABITACION_NO_ENCONTRADA + id));
    }

    private void validarNumeroIdentificadorDisponible(String numeroIdentificador, UUID idActual) {
        String numeroNormalizado = numeroIdentificador == null ? null : numeroIdentificador.trim();

        boolean yaExiste = idActual == null
                ? habitacionRepository.existsByNumeroIdentificador(numeroNormalizado)
                : habitacionRepository.existsByNumeroIdentificadorAndIdNot(numeroNormalizado, idActual);

        if (yaExiste) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una habitación registrada con el número identificador " + numeroNormalizado);
        }
    }

    private EstadoHabitacion parseEstado(String estado) {
        try {
            return EstadoHabitacion.valueOf(estado.trim().replace(" ", "_").toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido: " + estado);
        }
    }

    private HabitacionResponseDTO mapToResponse(Habitacion habitacion) {
        HabitacionResponseDTO response = new HabitacionResponseDTO();
        response.setId(habitacion.getId());
        response.setNumeroIdentificador(habitacion.getNumeroIdentificador());
        response.setTipo(habitacion.getTipo());
        response.setDescripcion(habitacion.getDescripcion());
        response.setCapacidadMaxima(habitacion.getCapacidadMaxima());
        response.setPrecioNoche(habitacion.getPrecioNoche());
        response.setEstado(habitacion.getEstado());
        return response;
    }
}
