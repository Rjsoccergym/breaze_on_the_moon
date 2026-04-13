package org.booking.com.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.booking.com.domain.enums.EstadoReserva;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "reservas")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Reservacion extends BaseEntity {

    @Column(nullable = false)
    private UUID habitacionId; // Referencia al Room Service

    @Column(nullable = false)
    private UUID clienteId;    // Referencia al Auth Service

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "monto_total")
    private BigDecimal montoTotal;

    @Enumerated(EnumType.STRING)
    private EstadoReserva estado;
}