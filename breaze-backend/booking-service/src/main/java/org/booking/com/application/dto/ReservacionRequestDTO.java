package org.booking.com.application.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ReservacionRequestDTO {

    private UUID clienteId;

    private UUID habitacionId;

    @FutureOrPresent(message = "La fecha de inicio no puede ser en el pasado")
    private LocalDate fechaInicio;

    @Future(message = "La fecha de fin debe ser una fecha futura")
    private LocalDate fechaFin;
}
