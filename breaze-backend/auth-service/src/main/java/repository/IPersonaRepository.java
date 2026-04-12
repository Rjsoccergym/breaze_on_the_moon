package repository;

import model.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IPersonaRepository extends JpaRepository<Persona, UUID> {
    Optional<Persona> findByUsername(String username);
    Optional<Persona> findByEmail(String email);
    Optional<Persona> findByNumeroIdentificacion(String numeroIdentificacion);
}
