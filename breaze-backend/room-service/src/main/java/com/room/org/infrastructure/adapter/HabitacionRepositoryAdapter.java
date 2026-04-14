package com.room.org.infrastructure.adapter;

import com.room.org.domain.entity.Habitacion;
import com.room.org.domain.enums.EstadoHabitacion;
import com.room.org.domain.repository.IHabitacionRepository;
import com.room.org.infrastructure.repository.SpringDataHabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class HabitacionRepositoryAdapter implements IHabitacionRepository {

    private final SpringDataHabitacionRepository repository;

    @Override
    public Habitacion save(Habitacion habitacion) {
        return repository.save(habitacion);
    }

    @Override
    public Habitacion saveAndFlush(Habitacion habitacion) {
        return repository.saveAndFlush(habitacion);
    }

    @Override
    public Optional<Habitacion> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<Habitacion> findAll() {
        return repository.findAll();
    }

    @Override
    public List<Habitacion> findByEstado(EstadoHabitacion estado) {
        return repository.findByEstado(estado);
    }

    @Override
    public Optional<Habitacion> findByNumeroIdentificador(String numeroIdentificador) {
        return repository.findByNumeroIdentificador(numeroIdentificador);
    }

    @Override
    public boolean existsByNumeroIdentificador(String numeroIdentificador) {
        return repository.existsByNumeroIdentificador(numeroIdentificador);
    }

    @Override
    public boolean existsByNumeroIdentificadorAndIdNot(String numeroIdentificador, UUID id) {
        return repository.existsByNumeroIdentificadorAndIdNot(numeroIdentificador, id);
    }
}

