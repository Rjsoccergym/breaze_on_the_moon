package repository;

import model.entity.Habitacion;
import model.enums.EstadoHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IHabitacionRepository extends JpaRepository<Habitacion, UUID> {

    // Para cumplir con el requerimiento de consultar por estado
    List<Habitacion> findByEstado(EstadoHabitacion estado);

    Optional<Habitacion> findByNumeroIdentificador(String numeroIdentificador);
}
