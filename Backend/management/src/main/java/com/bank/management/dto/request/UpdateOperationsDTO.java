package com.bank.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data

public class UpdateOperationsDTO {
    private Long id;

    @NotBlank(message =  "Nombre no puede estar vacio")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El nombre debe tener solo letras y espacios")
    private Double amount;

    @NotBlank(message =  "El tipo no puede estar vacio")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El nombre debe tener solo letras y espacios")
    private String operationType;

    private Long usersId;
    private Long account;

    public UpdateOperationsDTO(Long id, Double amount, String operationType, Long usersId, Long account) {
        this.id = id;
        this.amount = amount;
        this.operationType = operationType;
        this.usersId = usersId;
        this.account = account;
    }
}
