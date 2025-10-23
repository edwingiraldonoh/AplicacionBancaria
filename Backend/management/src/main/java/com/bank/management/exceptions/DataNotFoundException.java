package com.bank.management.exceptions;

import lombok.Getter;

@Getter
public class DataNotFoundException extends RuntimeException {
    //Users with the id %d not found
    private final Long id;
    private final String entity;

    public DataNotFoundException(Long id, String entity) {
        super(String.format("%s con id %d no existe", entity,id));
        this.id = id;
        this.entity = entity;
    }
}
