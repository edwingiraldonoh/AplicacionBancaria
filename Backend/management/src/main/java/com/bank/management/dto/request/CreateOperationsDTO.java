package com.bank.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CreateOperationsDTO {

    @NotBlank(message =  "Nombre no puede estar vacio")
    @Pattern(regexp = "^^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El nombre debe tener solo letras y espacios")
    private Double amount;

    @NotBlank(message =  "El tipo no puede estar vacio")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]{2,20}$", message = "El nombre debe tener solo letras y espacios")
    private String operationType;
    private Long usersId;
    private Long accountId;
}