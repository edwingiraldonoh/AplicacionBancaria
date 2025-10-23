package com.bank.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsersDTO {
    private Long id;
    private String dni;
    private String name;
    private String email;
    private String password;
    private Long account;
    private String accountNumber;
    private Double saldo;
}