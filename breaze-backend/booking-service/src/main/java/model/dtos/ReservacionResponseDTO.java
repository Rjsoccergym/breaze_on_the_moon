package model.dtos;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReservacionResponseDTO {
    private UUID id;
    private UUID clienteId;
    private Long habitacionId;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private BigDecimal precioTotal;
    private String estado; // CREADA, CONFIRMADA, CANCELADA
}
