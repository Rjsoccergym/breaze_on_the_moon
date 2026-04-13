package com.room.org.application.dto;

import com.room.org.domain.enums.EstadoHabitacion;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarEstadoHabitacionRequest {

    @NotNull(message = "El estado es obligatorio")
    private EstadoHabitacion status;
}

