package com.bank.management.service.impl;

import com.bank.management.dto.request.CreateAccountDTO;
import com.bank.management.dto.request.UpdateAccountDTO;
import com.bank.management.dto.response.AccountDTO;
import com.bank.management.entity.Account;
import com.bank.management.exceptions.DataNotFoundException;
import com.bank.management.exceptions.ResourceNotFoundException;
import com.bank.management.mapper.AccountMapper;
import com.bank.management.repository.AccountRepository;
import com.bank.management.repository.UsersRepository;
import com.bank.management.service.AccountService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UsersRepository usersRepository;
    private final AccountMapper mapper;


    public AccountServiceImpl(AccountRepository accountRepository, UsersRepository usersRepository, AccountMapper mapper) {
        this.accountRepository = accountRepository;
        this.usersRepository = usersRepository;
        this.mapper = mapper;
    }


    @Override
    public AccountDTO createAccount(CreateAccountDTO dto) {
        // Mapear DTO a entidad
        Account account = mapper.toEntity(dto);

        // Guardar en BD
        account = accountRepository.save(account);

        // Retornar DTO
        return mapper.toDTO(account);
    }

    @Override
    public AccountDTO save(CreateAccountDTO createAccountDTO) {
        Account account = mapper.toEntity(createAccountDTO);
        Account accountSaved = accountRepository.save(account);
        return mapper.toDTO(accountSaved);
    }

    @Override
    public List<AccountDTO> getAll() {
        return accountRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public AccountDTO getById(Long id) {
        return mapper.toDTO(accountRepository.findById(id).orElseThrow(() -> new DataNotFoundException(id, "Account")));
    }

    @Override
    public AccountDTO update(UpdateAccountDTO updateAccountDTO) {
        Account account = accountRepository.findById(updateAccountDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró la cuenta con id " + updateAccountDTO.getId()
                ));

        mapper.updateEntity(account, updateAccountDTO);
        Account updated = accountRepository.save(account);
        return mapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar. La cuenta con id " + id + " no existe.");
        }
        accountRepository.deleteById(id);
    }

    @Override
    public AccountDTO getByAccountNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + accountNumber));
        return mapper.toDTO(account);
    }
}