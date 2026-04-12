package model.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;
import model.enums.TipoHabitacion;

import java.math.BigDecimal;

@Data
public class HabitacionRequestDTO {
    @NotBlank(message = "El número de habitación es obligatorio")
    private String numeroIdentificador;

    @NotBlank(message = "El tipo de habitación es obligatorio (sencilla, doble, suite)")
    private TipoHabitacion tipo;

    private String descripcion;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad mínima es 1")
    private Integer capacidadMaxima;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precioNoche;

    @NotBlank(message = "El estado inicial es obligatorio (disponible, ocupada, mantenimiento)")
    private String estado;
}