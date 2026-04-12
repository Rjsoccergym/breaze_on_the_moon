package model.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class HabitacionDTO {
    private String estado; // Para verificar si está DISPONIBLE
    private BigDecimal precioNoche; // Para calcular el total de la reserva
}
