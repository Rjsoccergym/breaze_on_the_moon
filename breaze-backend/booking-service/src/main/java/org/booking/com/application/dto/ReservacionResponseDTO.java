package org.booking.com.application.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ReservacionResponseDTO {
    private UUID id;
    private UUID clienteId;
    private UUID habitacionId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal precioTotal;
    private String estado;
}
