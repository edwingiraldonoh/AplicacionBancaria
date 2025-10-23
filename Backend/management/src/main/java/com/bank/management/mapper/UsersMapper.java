package com.bank.management.mapper;

import com.bank.management.dto.request.CreateUsersDTO;
import com.bank.management.dto.request.UpdateUsersDTO;
import com.bank.management.dto.response.UsersDTO;
import com.bank.management.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UsersMapper {

        @Mapping(target = "id", ignore = true)
        @Mapping(target = "operations", ignore = true)
        @Mapping(target = "accounts", ignore = true)
        Users toEntity(CreateUsersDTO dto);


        @Mapping(target = "account",
                        expression = "java(users.getAccounts() != null && !users.getAccounts().isEmpty() ? users.getAccounts().get(0).getId() : null)")

        @Mapping(target = "accountNumber", expression = "java(users.getPrincipalAccountNumber())")
        @Mapping(target = "saldo", expression = "java(users.getPrincipalAccountSaldo())")
        UsersDTO toDTO(Users users);

        @Mapping(target = "accounts", ignore = true)
        @Mapping(target = "operations", ignore = true)
        void updateEntity(@MappingTarget Users users, UpdateUsersDTO dto);
}
