package org.booking.com.application.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class HabitacionDTO {
    private UUID id;
    private String numeroIdentificador;
    private String estado; // Para verificar si está DISPONIBLE
    private BigDecimal precioNoche; // Para calcular el total de la reserva
}
