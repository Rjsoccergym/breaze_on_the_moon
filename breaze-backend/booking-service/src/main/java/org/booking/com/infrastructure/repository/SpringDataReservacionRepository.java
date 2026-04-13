package org.booking.com.infrastructure.repository;

import org.booking.com.domain.entity.Reservacion;
import org.booking.com.domain.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataReservacionRepository extends JpaRepository<Reservacion, UUID> {

    List<Reservacion> findByEstado(EstadoReserva estado);

    List<Reservacion> findByClienteId(UUID clienteId);

    List<Reservacion> findByHabitacionId(UUID habitacionId);

    boolean existsByHabitacionIdAndEstado(UUID habitacionId, EstadoReserva estado);
}

