package com.auth.org.application.dto;

import com.auth.org.domain.enums.TipoIdentificacion;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RegisterRequestDTO {
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotBlank(message = "El nombre es obligatoria")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    private TipoIdentificacion tipoIdentificacion;

    @Size(max = 50, message = "El número de identificación no puede superar 50 caracteres")
    private String numeroIdentificacion;

    @Pattern(regexp = "^$|^[0-9+\\-() ]{7,20}$", message = "Formato de teléfono inválido")
    private String telefono;

    @Past(message = "La fecha de nacimiento debe estar en el pasado")
    private LocalDate fechaNacimiento;
}