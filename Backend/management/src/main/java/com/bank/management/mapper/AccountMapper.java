package com.bank.management.mapper;

import com.bank.management.dto.request.CreateAccountDTO;
import com.bank.management.dto.request.UpdateAccountDTO;
import com.bank.management.dto.response.AccountDTO;
import com.bank.management.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UsersMapper.class})
public interface AccountMapper {

    @Mapping(source = "user.id", target = "usersId")
    AccountDTO toDTO(Account account);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "operations", ignore = true)
    @Mapping(target = "user", ignore = true)
    Account toEntity(CreateAccountDTO dto);

    // 3. Actualización de entidad con UpdateAccountDTO
    // CRÍTICO: Ignoramos la relación 'user' para no sobreescribirla en una actualización.
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "operations", ignore = true)
    void updateEntity(@MappingTarget Account account, UpdateAccountDTO dto);
}