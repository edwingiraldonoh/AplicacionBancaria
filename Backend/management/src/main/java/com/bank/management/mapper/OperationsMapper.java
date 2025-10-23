package com.bank.management.mapper;

import com.bank.management.dto.request.CreateOperationsDTO;
import com.bank.management.dto.request.UpdateOperationsDTO;
import com.bank.management.dto.response.OperationsDTO;
import com.bank.management.entity.Account;
import com.bank.management.entity.Operations;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OperationsMapper {

        @Mapping(target = "account",
                        expression = "java(operations.getAccount() == null ? null :  operations.getAccount().getId())")

        @Mapping(target = "usersId",
                        expression = "java(operations.getUsers() == null ? null : operations.getUsers().getId())")
        OperationsDTO toDTO(Operations operations); // <-- ¡ESTO FALTABA!

        // 2. Mapeo para listas de Operations a List<OperationsDTO>
        List<OperationsDTO> toDTO(List<Operations> operations); // <-- ¡Esto soluciona el error
                                                                // List<Object>!

        // 3. DTO a Entidad
        @Mapping(target = "id", ignore = true)
        @Mapping(target = "account", ignore = true)
        @Mapping(target = "users", ignore = true)
        @Mapping(target = "operationDate", ignore = true)
        Operations toEntity(CreateOperationsDTO dto);

        // 4. Mapeo de Referencia (para el Service o Mappers que usan Long)
        @Mapping(target = "id", source = "accountId")
        @Mapping(target = "accountNumber", ignore = true)
        @Mapping(target = "accountType", ignore = true)
        @Mapping(target = "saldo", ignore = true)
        @Mapping(target = "user", ignore = true)
        @Mapping(target = "operations", ignore = true)
        Account map(Long accountId);

        // 5. Actualización de Entidad
        @Mapping(target = "operationDate", ignore = true)
        @Mapping(target = "users", ignore = true)
        @Mapping(target = "account", ignore = true)
        void updateEntity(@MappingTarget Operations operations, UpdateOperationsDTO dto);
}
