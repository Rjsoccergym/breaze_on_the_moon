package org.booking.com.infrastructure.adapter;

import lombok.RequiredArgsConstructor;
import org.booking.com.domain.entity.Reservacion;
import org.booking.com.domain.enums.EstadoReserva;
import org.booking.com.domain.repository.IReservacionRepository;
import org.booking.com.infrastructure.repository.SpringDataReservacionRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ReservacionRepositoryAdapter implements IReservacionRepository {

    private final SpringDataReservacionRepository repository;

    @Override
    public Reservacion save(Reservacion reservacion) {
        return repository.save(reservacion);
    }

    @Override
    public Optional<Reservacion> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<Reservacion> findByEstado(EstadoReserva estado) {
        return repository.findByEstado(estado);
    }

    @Override
    public List<Reservacion> findByClienteId(UUID clienteId) {
        return repository.findByClienteId(clienteId);
    }

    @Override
    public List<Reservacion> findByHabitacionId(UUID habitacionId) {
        return repository.findByHabitacionId(habitacionId);
    }

    @Override
    public boolean existsByHabitacionIdAndEstado(UUID habitacionId, EstadoReserva estado) {
        return repository.existsByHabitacionIdAndEstado(habitacionId, estado);
    }
}

