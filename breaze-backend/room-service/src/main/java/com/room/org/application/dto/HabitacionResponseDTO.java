package com.room.org.application.dto;

import com.room.org.domain.enums.EstadoHabitacion;
import com.room.org.domain.enums.TipoHabitacion;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class HabitacionResponseDTO {
    private UUID id;
    private String numeroIdentificador;
    private TipoHabitacion tipo;
    private String descripcion;
    private Integer capacidadMaxima;
    private BigDecimal precioNoche;
    private EstadoHabitacion estado;
}
