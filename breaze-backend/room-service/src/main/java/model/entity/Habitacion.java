package model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import model.enums.EstadoHabitacion;
import model.enums.TipoHabitacion;

import java.math.BigDecimal;

@Entity
@Table(name = "habitaciones")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Habitacion extends BaseEntity {

    @Column(name = "numero_identificador", unique = true, nullable = false)
    private String numeroIdentificador;

    @Enumerated(EnumType.STRING)
    private TipoHabitacion tipo;

    private String descripcion;

    @Column(name = "capacidad_maxima")
    private Integer capacidadMaxima;

    @Column(name = "precio_noche")
    private BigDecimal precioNoche;

    @Enumerated(EnumType.STRING)
    private EstadoHabitacion estado;
}
