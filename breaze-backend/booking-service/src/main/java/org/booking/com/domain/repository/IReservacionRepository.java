package org.booking.com.domain.repository;

import org.booking.com.domain.entity.Reservacion;
import org.booking.com.domain.enums.EstadoReserva;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IReservacionRepository {

    Reservacion save(Reservacion reservacion);

    Reservacion saveAndFlush(Reservacion reservacion);

    Optional<Reservacion> findById(UUID id);

    List<Reservacion> findByEstado(EstadoReserva estado);

    List<Reservacion> findByClienteId(UUID clienteId);

    List<Reservacion> findByHabitacionId(UUID habitacionId);

    boolean existsByHabitacionIdAndEstado(UUID habitacionId, EstadoReserva estado);
}
