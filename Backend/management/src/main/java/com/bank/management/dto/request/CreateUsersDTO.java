package com.bank.management.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CreateUsersDTO {

    @NotBlank(message = "DNI no puede estar vacio")
    @Pattern(regexp = "^[0-9]{10}$", message = "DNI debe tener 10 numeros")
    @Positive(message = "DNI debe ser un numero positivo")
    private String dni;

    @NotBlank(message =  "Nombre no puede estar vacio")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El nombre debe tener solo letras y espacios")
    private String name;

    @NotBlank(message = "El email no puede estar vacio")
    @Email
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacia")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;





    
}