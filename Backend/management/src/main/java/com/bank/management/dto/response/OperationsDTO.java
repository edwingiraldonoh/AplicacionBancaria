package com.bank.management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OperationsDTO {
    private Long id;
    private Double amount;
    private String operationType;
    private Long usersId;
    private Long account;
}