package service;

import client.IHabitacionCliente;
import exception.DomainException;
import exception.ReservacionNotFoundException;
import lombok.RequiredArgsConstructor;
import model.dtos.ReservacionRequestDTO;
import model.dtos.ReservacionResponseDTO;
import model.entity.Reservacion;
import model.enums.EstadoReserva;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.IReservacionRepository;

import java.util.UUID;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReservacionService {

    private final IReservacionRepository repository;
    private final IHabitacionCliente habitacionCliente; // La interfaz de tu diagrama
    private final IEventPublisher eventPublisher;

    @Transactional
    public ReservacionResponseDTO crearReservacion(ReservacionRequestDTO dto) {
        // 1. Regla de Negocio: Verificar disponibilidad en el otro micro
        boolean disponible = habitacionCliente.verificarDisponibilidad(dto.getHabitacionId());

        if (!disponible) {
            throw new DomainException("La habitación no está disponible para las fechas seleccionadas");
        }

        // 2. Crear objeto
        Reservacion nueva = new Reservacion();
        nueva.setClienteId(dto.getClienteId());
        nueva.setHabitacionId(dto.getHabitacionId());
        nueva.setFechaInicio(dto.getFechaInicio());
        nueva.setFechaFin(dto.getFechaFin());
        nueva.setEstado(EstadoReserva.CREADA);

        Reservacion guardada = repository.save(nueva);

        // 3. Notificar a Lambda vía EventPublisher (Caja naranja)
        eventPublisher.notificarEvento("RESERVA_CREADA", guardada.getId().toString());

        return mapearAResponse(guardada);
    }

    public void confirmarReservacion(UUID id) {
        Reservacion res = repository.findById(id)
                .orElseThrow(() -> new ReservacionNotFoundException("Reserva no encontrada"));

        res.setEstado(EstadoReserva.CONFIRMADA);
        repository.save(res);

        // Actualizar el estado de la habitación a OCUPADA
        habitacionCliente.actualizarEstadoHabitacion(res.getHabitacionId(), Map.of("status", "OCUPADA"));

        // Notificación de Auditoría
        eventPublisher.notificarEvento("RESERVA_CONFIRMADA", "ID Reserva: " + id);
    }

    private ReservacionResponseDTO mapearAResponse(Reservacion entidad) {
        ReservacionResponseDTO dto = new ReservacionResponseDTO();
        dto.setId(entidad.getId());
        dto.setClienteId(entidad.getClienteId());
        dto.setHabitacionId(entidad.getHabitacionId());
        dto.setFechaInicio(entidad.getFechaInicio());
        dto.setFechaFin(entidad.getFechaFin());
        dto.setEstado(entidad.getEstado().name());
        return dto;
    }
}