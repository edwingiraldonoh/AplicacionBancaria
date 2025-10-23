package com.bank.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransactionRequestDTO {

    @NotBlank(message = "El DNI de origen no puede estar vacío")
    private String fromAccount;

    @NotBlank(message = "El DNI de destino no puede estar vacío")
    private String toAccount;

    @NotNull(message = "El monto no puede ser nulo")
    private Double amount;

    @NotBlank(message = "El tipo de transacción no puede estar vacío")
    private String type; // DEPOSITO o RETIRO
}