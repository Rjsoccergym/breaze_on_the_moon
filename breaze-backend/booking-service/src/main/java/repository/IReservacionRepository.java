package repository;

import model.entity.Reservacion;
import model.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IReservacionRepository extends JpaRepository<Reservacion, UUID> {

    List<Reservacion> findByEstado(EstadoReserva estado);

    List<Reservacion> findByClienteId(UUID clienteId);

    List<Reservacion> findByHabitacionId(UUID habitacionId);
    
    // Sugerencia: Verificar si existe reserva activa para una habitación en fechas dadas
    boolean existsByHabitacionIdAndEstado(UUID habitacionId, EstadoReserva estado);
}
