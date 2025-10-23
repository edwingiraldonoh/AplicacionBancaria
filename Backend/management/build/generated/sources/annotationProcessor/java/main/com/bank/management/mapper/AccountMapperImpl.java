package com.bank.management.mapper;

import com.bank.management.dto.request.CreateAccountDTO;
import com.bank.management.dto.request.UpdateAccountDTO;
import com.bank.management.dto.response.AccountDTO;
import com.bank.management.entity.Account;
import com.bank.management.entity.Users;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-23T14:42:09-0500",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Override
    public AccountDTO toDTO(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountDTO accountDTO = new AccountDTO();

        accountDTO.setUsersId( accountUserId( account ) );
        accountDTO.setId( account.getId() );
        accountDTO.setAccountNumber( account.getAccountNumber() );
        accountDTO.setAccountType( account.getAccountType() );
        accountDTO.setSaldo( account.getSaldo() );

        return accountDTO;
    }

    @Override
    public Account toEntity(CreateAccountDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Account account = new Account();

        account.setAccountNumber( dto.getAccountNumber() );
        account.setAccountType( dto.getAccountType() );
        account.setSaldo( dto.getSaldo() );

        return account;
    }

    @Override
    public void updateEntity(Account account, UpdateAccountDTO dto) {
        if ( dto == null ) {
            return;
        }

        account.setId( dto.getId() );
        account.setAccountNumber( dto.getAccountNumber() );
        account.setAccountType( dto.getAccountType() );
        account.setSaldo( dto.getSaldo() );
    }

    private Long accountUserId(Account account) {
        if ( account == null ) {
            return null;
        }
        Users user = account.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
