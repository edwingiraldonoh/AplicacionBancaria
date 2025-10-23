package com.bank.management.exceptions;


import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.util.Map;


@Getter
@Setter
@AllArgsConstructor
public class ValidationErrorResponse {
    private int status;
    Map<String, String> errors;
}
