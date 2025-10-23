package com.bank.management.service;

import com.bank.management.dto.request.CreateAccountDTO;
import com.bank.management.dto.request.UpdateAccountDTO;
import com.bank.management.dto.response.AccountDTO;

import java.util.List;

public interface AccountService {
    AccountDTO createAccount(CreateAccountDTO dto);
    AccountDTO save(CreateAccountDTO createAccountDTO);
    List<AccountDTO> getAll();
    AccountDTO getById(Long id);
    AccountDTO update(UpdateAccountDTO dto);
    void delete(Long id);
    AccountDTO getByAccountNumber(String accountNumber);
}
