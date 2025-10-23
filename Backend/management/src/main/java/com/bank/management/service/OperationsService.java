package com.bank.management.service;


import com.bank.management.dto.request.CreateOperationsDTO;
import com.bank.management.dto.request.TransactionRequestDTO;
import com.bank.management.dto.request.UpdateOperationsDTO;
import com.bank.management.dto.response.OperationsDTO;

import java.util.List;

public interface OperationsService {
    OperationsDTO save(CreateOperationsDTO createOperationsDTO);
    List<OperationsDTO> getAll();
    OperationsDTO getById(Long id);
    OperationsDTO update(UpdateOperationsDTO updateOperationsDTO);
    void delete(Long id);
    void performTransaction(TransactionRequestDTO transactionRequestDTO);
}
