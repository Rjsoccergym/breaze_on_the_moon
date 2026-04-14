package com.room.org.domain.repository;

import com.room.org.domain.entity.Habitacion;
import com.room.org.domain.enums.EstadoHabitacion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IHabitacionRepository {

    Habitacion save(Habitacion habitacion);

    Habitacion saveAndFlush(Habitacion habitacion);

    Optional<Habitacion> findById(UUID id);

    List<Habitacion> findAll();

    List<Habitacion> findByEstado(EstadoHabitacion estado);

    Optional<Habitacion> findByNumeroIdentificador(String numeroIdentificador);

    boolean existsByNumeroIdentificador(String numeroIdentificador);

    boolean existsByNumeroIdentificadorAndIdNot(String numeroIdentificador, UUID id);
}
