package com.bank.management.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data

public class UpdateUsersDTO {
    private Long id;

    @NotBlank(message = "DNI no puede estar vacio")
    @Pattern(regexp = "^[0-9]{10}$", message = "DNI debe tener 10 numeros")
    @Positive(message = "DNI debe ser un numero positivo")
    private String dni;

    @NotBlank(message =  "El tipo de cuenta no puede estar vacio")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El tipo de cuents debe tener solo letras y espacios")
    private String name;

    @NotBlank(message = "El email no puede estar vacio")
    @Email
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacia")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;
    private Long account;


    public UpdateUsersDTO(Long id, String dni, String name, String email, String password, Long account) {
        this.id = id;
        this.dni = dni;
        this.name = name;
        this.email = email;
        this.password = password;
        this.account = account;
    }
}
