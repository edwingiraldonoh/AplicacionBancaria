package com.bank.management.mapper;

import com.bank.management.dto.request.CreateUsersDTO;
import com.bank.management.dto.request.UpdateUsersDTO;
import com.bank.management.dto.response.UsersDTO;
import com.bank.management.entity.Users;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-23T14:42:09-0500",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class UsersMapperImpl implements UsersMapper {

    @Override
    public Users toEntity(CreateUsersDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Users users = new Users();

        users.setDni( dto.getDni() );
        users.setName( dto.getName() );
        users.setEmail( dto.getEmail() );
        users.setPassword( dto.getPassword() );

        return users;
    }

    @Override
    public UsersDTO toDTO(Users users) {
        if ( users == null ) {
            return null;
        }

        UsersDTO usersDTO = new UsersDTO();

        usersDTO.setId( users.getId() );
        usersDTO.setDni( users.getDni() );
        usersDTO.setName( users.getName() );
        usersDTO.setEmail( users.getEmail() );
        usersDTO.setPassword( users.getPassword() );

        usersDTO.setAccount( users.getAccounts() != null && !users.getAccounts().isEmpty() ? users.getAccounts().get(0).getId() : null );
        usersDTO.setAccountNumber( users.getPrincipalAccountNumber() );
        usersDTO.setSaldo( users.getPrincipalAccountSaldo() );

        return usersDTO;
    }

    @Override
    public void updateEntity(Users users, UpdateUsersDTO dto) {
        if ( dto == null ) {
            return;
        }

        users.setId( dto.getId() );
        users.setDni( dto.getDni() );
        users.setName( dto.getName() );
        users.setEmail( dto.getEmail() );
        users.setPassword( dto.getPassword() );
    }
}
