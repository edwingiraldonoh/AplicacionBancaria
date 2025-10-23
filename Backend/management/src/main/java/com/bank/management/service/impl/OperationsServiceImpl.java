package com.bank.management.service.impl;

import com.bank.management.dto.request.TransactionRequestDTO;
import com.bank.management.dto.request.UpdateOperationsDTO;
import com.bank.management.entity.Account;
import com.bank.management.entity.Operations;
import com.bank.management.entity.Users;
import com.bank.management.exceptions.DataNotFoundException;
import com.bank.management.exceptions.ResourceNotFoundException;
import com.bank.management.repository.AccountRepository;
import com.bank.management.repository.OperationsRepository;
import com.bank.management.repository.UsersRepository;
import com.bank.management.service.OperationsService;
import org.springframework.stereotype.Service;
import com.bank.management.dto.request.CreateOperationsDTO;
import com.bank.management.dto.response.OperationsDTO;
import com.bank.management.mapper.OperationsMapper;
import jakarta.transaction.Transactional; // Para el @Transactional
import java.time.LocalDateTime;
import java.util.List;


@Service
public class OperationsServiceImpl implements OperationsService {

    private final OperationsRepository operationsRepository;
    private final OperationsMapper mapper;
    private final AccountRepository accountRepository;
    private final UsersRepository usersRepository;

    public OperationsServiceImpl(OperationsRepository operationsRepository, OperationsMapper mapper,
            AccountRepository accountRepository, UsersRepository usersRepository) {
        this.operationsRepository = operationsRepository;
        this.mapper = mapper;
        this.accountRepository = accountRepository;
        this.usersRepository = usersRepository;
    }

    @Override
    public OperationsDTO save(CreateOperationsDTO dto) {
        Account account = accountRepository.findById(dto.getAccountId()).get();
        Users users = usersRepository.findById(dto.getUsersId()).get();
        users.setAccounts(account.getUser().getAccounts());
        usersRepository.save(users);

        // Crear la operacion y asignar las relaciones
        Operations appToSave = mapper.toEntity(dto);
        appToSave.setAccount(account);
        appToSave.setUsers(users);

        return mapper.toDTO(operationsRepository.save(appToSave));
    }

    @Override
    public List<OperationsDTO> getAll() {
        return operationsRepository.findAll().stream().map(operations -> mapper.toDTO(operations))
                .toList();
    }

    @Override
    public OperationsDTO getById(Long id) {
        return mapper.toDTO(operationsRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(id, "Operations")));
    }

    @Override
    public OperationsDTO update(UpdateOperationsDTO updateOperationsDTO) {
        Operations operations = operationsRepository.findById(updateOperationsDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró la cuenta con id " + updateOperationsDTO.getId()));

        mapper.updateEntity(operations, updateOperationsDTO);
        Operations updated = operationsRepository.save(operations);
        return mapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        if (!operationsRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "No se puede eliminar. La operacion con id " + id + " no existe.");
        }
        operationsRepository.deleteById(id);
    }

    @Override
    @jakarta.transaction.Transactional // Asegura que si falla una parte, todo se revierte
    public void performTransaction(TransactionRequestDTO request) {

        // 1. Obtener Cuentas por Número (DNI)
        // El 'fromAccount' es el DNI de origen y 'toAccount' es el DNI de destino
        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccount())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cuenta de origen no encontrada: " + request.getFromAccount()));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccount())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cuenta de destino no encontrada: " + request.getToAccount()));

        Double amount = request.getAmount();

        // 2. Validación CRÍTICA de Saldo
        if (fromAccount.getSaldo() < amount) {
            // Debes lanzar una excepción para saldo insuficiente
            throw new RuntimeException(
                    "Saldo insuficiente en la cuenta de origen: " + fromAccount.getAccountNumber());
        }

        // 3. Débito y Crédito (La transferencia propiamente dicha)
        fromAccount.setSaldo(fromAccount.getSaldo() - amount);
        toAccount.setSaldo(toAccount.getSaldo() + amount);

        // 4. Guardar Cuentas Actualizadas
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // 5. Registrar Operaciones (Dos registros por ser una transferencia)

        // A. Registro de Débito (Salida)
        Operations debitOperation = new Operations();
        debitOperation.setAccount(fromAccount);
        debitOperation.setAmount(-amount); // Monto negativo
        debitOperation.setOperationType("TRANSFERENCIA_ENVIADA");
        debitOperation.setOperationDate(java.time.LocalDateTime.now());
        operationsRepository.save(debitOperation);

        // B. Registro de Crédito (Entrada)
        Operations creditOperation = new Operations();
        creditOperation.setAccount(toAccount);
        creditOperation.setAmount(amount); // Monto positivo
        creditOperation.setOperationType("TRANSFERENCIA_RECIBIDA");
        creditOperation.setOperationDate(java.time.LocalDateTime.now());
        operationsRepository.save(creditOperation);
    }
}
