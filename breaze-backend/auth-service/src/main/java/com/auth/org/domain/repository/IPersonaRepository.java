package com.auth.org.domain.repository;

import com.auth.org.domain.entity.Persona;
import java.util.Optional;

public interface IPersonaRepository {
    Optional<Persona> findByUsername(String username);
    Optional<Persona> findByEmail(String email);
    Optional<Persona> findByNumeroIdentificacion(String numeroIdentificacion);
    Persona save(Persona persona);
}
