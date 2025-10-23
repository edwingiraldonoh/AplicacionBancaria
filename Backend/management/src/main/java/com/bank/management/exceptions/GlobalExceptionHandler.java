package com.bank.management.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    //1. DataNotFountException
    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity <ErrorResponse> handleNotFound(DataNotFoundException ex){
        ErrorResponse error= new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    //2. Data Duplicated
    @ExceptionHandler(DuplicatedDataException.class)
    public ResponseEntity<ErrorResponse> handleDuplicated(DuplicatedDataException ex) {
        ErrorResponse error= new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage()
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    //3. Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidations(MethodArgumentNotValidException ex) {
        //1. Define el mapa de errores como el que tiene Validation Error Response
        Map<String, String> errors = new HashMap<>();

        //2. Captura de los errores que ocurrieron
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            if (fieldError.getDefaultMessage() != null) {
                errors.put(
                        fieldError.getField(),
                        String.format("Field '%s': %s", fieldError.getField(), fieldError.getDefaultMessage())
                );
            }
        }

        //3. Definir la instancia
        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                errors
        );
        //4. Devolver
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );
    }
}
