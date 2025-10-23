package com.bank.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AccountDTO {
    private Long id;
    private String accountNumber;
    private String accountType;
    private Double saldo;
    private Long usersId;
}