package org.booking.com.application.service;

import org.booking.com.application.client.IHabitacionCliente;
import org.booking.com.domain.exception.DomainException;
import org.booking.com.domain.exception.ReservacionNotFoundException;
import org.booking.com.domain.exception.UnauthorizedActionException;
import lombok.RequiredArgsConstructor;
import org.booking.com.application.dto.HabitacionDTO;
import org.booking.com.application.dto.ReservacionRequestDTO;
import org.booking.com.application.dto.ReservacionResponseDTO;
import org.booking.com.domain.entity.Reservacion;
import org.booking.com.domain.enums.EstadoReserva;
import org.booking.com.application.port.IEventPublisherPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.booking.com.domain.repository.IReservacionRepository;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservacionService {

    private static final String MENSAJE_RESERVA_NO_ENCONTRADA = "Reserva no encontrada";

    private final IReservacionRepository repository;
    private final IHabitacionCliente habitacionCliente;
    private final IEventPublisherPort eventPublisher;

    @Transactional
    public ReservacionResponseDTO crearReservacion(ReservacionRequestDTO dto, UUID usuarioAutenticadoId, boolean esAdmin) {
        validarSolicitud(dto);

        UUID clienteId = resolverClienteId(dto, usuarioAutenticadoId, esAdmin);
        boolean disponible = Boolean.TRUE.equals(habitacionCliente.verificarDisponibilidad(dto.getHabitacionId()).get("available"));
        if (!disponible) {
            throw new DomainException("La habitación no está disponible para las fechas seleccionadas");
        }

        HabitacionDTO habitacion = habitacionCliente.obtenerHabitacion(dto.getHabitacionId());
        Reservacion nueva = new Reservacion();
        nueva.setClienteId(clienteId);
        nueva.setHabitacionId(dto.getHabitacionId());
        nueva.setFechaInicio(dto.getFechaInicio());
        nueva.setFechaFin(dto.getFechaFin());
        nueva.setMontoTotal(calcularMontoTotal(habitacion.getPrecioNoche(), dto));
        nueva.setEstado(EstadoReserva.CREADA);

        Reservacion guardada = repository.saveAndFlush(nueva);
        eventPublisher.notificarEvento("RESERVA_CREADA", guardada.getId().toString());
        return mapearAResponse(guardada);
    }

    @Transactional
    public void confirmarReservacion(UUID id) {
        Reservacion reservacion = buscarReservacion(id);
        reservacion.setEstado(EstadoReserva.CONFIRMADA);
        repository.saveAndFlush(reservacion);
        habitacionCliente.actualizarEstadoHabitacion(reservacion.getHabitacionId(), Map.of("status", "OCUPADA"));
        eventPublisher.notificarEvento("RESERVA_CONFIRMADA", "ID Reserva: " + id);
    }

    @Transactional(readOnly = true)
    public List<ReservacionResponseDTO> findByEstado(EstadoReserva estado) {
        return repository.findByEstado(estado).stream()
                .map(this::mapearAResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservacionResponseDTO> findByClienteId(UUID clienteId, UUID usuarioAutenticadoId, boolean esAdmin) {
        if (!esAdmin && !clienteId.equals(usuarioAutenticadoId)) {
            throw new UnauthorizedActionException("Solo puedes consultar tus propias reservas");
        }
        return repository.findByClienteId(clienteId).stream()
                .map(this::mapearAResponse)
                .toList();
    }

    @Transactional
    public void cancelarReservacion(UUID id, UUID usuarioAutenticadoId, boolean esAdmin) {
        Reservacion reservacion = buscarReservacion(id);
        if (!esAdmin && !reservacion.getClienteId().equals(usuarioAutenticadoId)) {
            throw new UnauthorizedActionException("Solo puedes cancelar tus propias reservas");
        }

        reservacion.setEstado(EstadoReserva.CANCELADA);
        repository.saveAndFlush(reservacion);
        habitacionCliente.actualizarEstadoHabitacion(reservacion.getHabitacionId(), Map.of("status", "DISPONIBLE"));
        eventPublisher.notificarEvento("RESERVA_CANCELADA", "ID Reserva: " + id);
    }

    private Reservacion buscarReservacion(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ReservacionNotFoundException(MENSAJE_RESERVA_NO_ENCONTRADA));
    }

    private void validarSolicitud(ReservacionRequestDTO dto) {
        if (dto.getHabitacionId() == null) {
            throw new DomainException("El ID de la habitación es obligatorio");
        }
        if (dto.getFechaInicio() == null || dto.getFechaFin() == null) {
            throw new DomainException("Las fechas de la reserva son obligatorias");
        }
        if (!dto.getFechaFin().isAfter(dto.getFechaInicio())) {
            throw new DomainException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
    }

    private UUID resolverClienteId(ReservacionRequestDTO dto, UUID usuarioAutenticadoId, boolean esAdmin) {
        if (esAdmin) {
            if (dto.getClienteId() != null) {
                return dto.getClienteId();
            }
            if (usuarioAutenticadoId != null) {
                return usuarioAutenticadoId;
            }
            throw new DomainException("No fue posible determinar el cliente de la reserva");
        }

        if (usuarioAutenticadoId == null) {
            throw new UnauthorizedActionException("No se pudo resolver la identidad del cliente autenticado");
        }
        return usuarioAutenticadoId;
    }

    private BigDecimal calcularMontoTotal(BigDecimal precioNoche, ReservacionRequestDTO dto) {
        long noches = ChronoUnit.DAYS.between(dto.getFechaInicio(), dto.getFechaFin());
        return precioNoche.multiply(BigDecimal.valueOf(noches));
    }

    private ReservacionResponseDTO mapearAResponse(Reservacion entidad) {
        ReservacionResponseDTO dto = new ReservacionResponseDTO();
        dto.setId(entidad.getId());
        dto.setClienteId(entidad.getClienteId());
        dto.setHabitacionId(entidad.getHabitacionId());
        dto.setFechaInicio(entidad.getFechaInicio());
        dto.setFechaFin(entidad.getFechaFin());
        dto.setPrecioTotal(entidad.getMontoTotal());
        dto.setEstado(entidad.getEstado().name());
        dto.setCreatedAt(entidad.getCreatedAt());
        dto.setUpdatedAt(entidad.getUpdatedAt());
        return dto;
    }
}