package com.bank.management.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.CONFLICT)
@Getter
public class DuplicatedDataException extends RuntimeException {
    private final String entity;
    private final String dni;
    public DuplicatedDataException(String entity, String dni) {
        super(String.format("%s con DNI %s ya existe", entity, dni));
        this.entity = entity;
        this.dni = dni;
    }

    public DuplicatedDataException(String message) {
        super(message);
        this.entity = null;
        this.dni = null;
    }
}
