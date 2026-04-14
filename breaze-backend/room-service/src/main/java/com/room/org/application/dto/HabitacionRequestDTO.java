package com.room.org.application.dto;

import com.room.org.domain.enums.TipoHabitacion;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class HabitacionRequestDTO {

    @NotBlank(message = "El número identificador es obligatorio")
    private String numeroIdentificador;

    @NotNull(message = "El tipo de habitación es obligatorio (sencilla, doble, suite)")
    private TipoHabitacion tipo;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad mínima es 1")
    private Integer capacidadMaxima;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precioNoche;
}
