package com.bank.management.mapper;

import com.bank.management.dto.request.CreateOperationsDTO;
import com.bank.management.dto.request.UpdateOperationsDTO;
import com.bank.management.dto.response.OperationsDTO;
import com.bank.management.entity.Account;
import com.bank.management.entity.Operations;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-23T00:07:11-0500",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class OperationsMapperImpl implements OperationsMapper {

    @Override
    public OperationsDTO toDTO(Operations operations) {
        if ( operations == null ) {
            return null;
        }

        OperationsDTO operationsDTO = new OperationsDTO();

        operationsDTO.setId( operations.getId() );
        operationsDTO.setAmount( operations.getAmount() );
        operationsDTO.setOperationType( operations.getOperationType() );

        operationsDTO.setAccount( operations.getAccount() == null ? null :  operations.getAccount().getId() );
        operationsDTO.setUsersId( operations.getUsers() == null ? null : operations.getUsers().getId() );

        return operationsDTO;
    }

    @Override
    public List<OperationsDTO> toDTO(List<Operations> operations) {
        if ( operations == null ) {
            return null;
        }

        List<OperationsDTO> list = new ArrayList<OperationsDTO>( operations.size() );
        for ( Operations operations1 : operations ) {
            list.add( toDTO( operations1 ) );
        }

        return list;
    }

    @Override
    public Operations toEntity(CreateOperationsDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Operations operations = new Operations();

        operations.setAmount( dto.getAmount() );
        operations.setOperationType( dto.getOperationType() );

        return operations;
    }

    @Override
    public Account map(Long accountId) {
        if ( accountId == null ) {
            return null;
        }

        Account account = new Account();

        account.setId( accountId );

        return account;
    }

    @Override
    public void updateEntity(Operations operations, UpdateOperationsDTO dto) {
        if ( dto == null ) {
            return;
        }

        operations.setId( dto.getId() );
        operations.setAmount( dto.getAmount() );
        operations.setOperationType( dto.getOperationType() );
    }
}
