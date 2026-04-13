package com.auth.org.infrastructure.repository;

import com.auth.org.domain.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpringDataPersonaRepository extends JpaRepository<Persona, UUID> {
    Optional<Persona> findByUsername(String username);
    Optional<Persona> findByEmail(String email);
    Optional<Persona> findByNumeroIdentificacion(String numeroIdentificacion);
}


