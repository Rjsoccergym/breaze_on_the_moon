package repository;

import model.entity.Reservacion;
import model.enums.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IReservacionRepository extends JpaRepository<Reservacion, UUID> {

    // Según tu diagrama: findByEstado()
    // Útil para que el administrador vea cuántas reservas están "CONFIRMADAS" o "CREADAS"
    List<Reservacion> findByEstado(EstadoReserva estado);

    // Búsqueda por cliente (Relación lógica con el micro de Auth)
    // Para que un cliente pueda ver su historial de reservas
    List<Reservacion> findByClienteId(UUID clienteId);

    // Búsqueda por habitación (Relación lógica con el micro de Rooms)
    // Para saber si una habitación específica ha tenido reservas previas
    List<Reservacion> findByHabitacionId(UUID habitacionId);
}
