package com.auth.org.infrastructure.adapter;

import com.auth.org.domain.entity.Persona;
import com.auth.org.domain.repository.IPersonaRepository;
import com.auth.org.infrastructure.repository.SpringDataPersonaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PersonaRepositoryAdapter implements IPersonaRepository {

    private final SpringDataPersonaRepository repository;

    @Override
    public Optional<Persona> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public Optional<Persona> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public Optional<Persona> findByNumeroIdentificacion(String numeroIdentificacion) {
        return repository.findByNumeroIdentificacion(numeroIdentificacion);
    }

    @Override
    public Persona save(Persona persona) {
        return repository.save(persona);
    }
}
