package com.auth.org.application.dto;

import com.auth.org.domain.enums.TipoIdentificacion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {

    private String token;
    private UUID userId;
    private String username;
    private String nombre;
    private String apellido;
    private String email;
    private String rol; // ADMIN o CLIENT
    private TipoIdentificacion tipoIdentificacion;
    private String numeroIdentificacion;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String mensaje;
}
