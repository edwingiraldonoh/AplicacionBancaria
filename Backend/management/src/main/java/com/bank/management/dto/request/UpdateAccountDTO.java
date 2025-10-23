package com.bank.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data

public class UpdateAccountDTO {
    private Long id;

    @NotBlank(message = "El numero de cuenta no puede estar vacio")
    @Pattern(regexp = "^[0-9\\s]{2,20}$", message = "El numero de cuenta solo debe tener numeros y espacios")
    private String AccountNumber;

    @NotBlank(message =  "El tipo de cuenta no puede estar vacio")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El tipo de cuents debe tener solo letras y espacios")
    private String accountType;

    @NotBlank(message = "El saldo no puede estar vacio")
    @Pattern(regexp = "^[0-9]{2,20}$", message = "El saldo solo debe tener numeros")
    private Double saldo;

    //Este nos ayuda a relacionar la cuenta con un cliente
    private Long customerId;
}
