package com.room.org.infrastructure.repository;

import com.room.org.domain.entity.Habitacion;
import com.room.org.domain.enums.EstadoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataHabitacionRepository extends JpaRepository<Habitacion, UUID> {

    List<Habitacion> findByEstado(EstadoHabitacion estado);

    Optional<Habitacion> findByNumeroIdentificador(String numeroIdentificador);

    boolean existsByNumeroIdentificador(String numeroIdentificador);

    boolean existsByNumeroIdentificadorAndIdNot(String numeroIdentificador, UUID id);
}

