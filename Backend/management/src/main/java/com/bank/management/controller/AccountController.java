package com.bank.management.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.bank.management.dto.request.CreateAccountDTO;
import com.bank.management.dto.request.UpdateAccountDTO;
import com.bank.management.dto.response.AccountDTO;
import com.bank.management.exceptions.ResourceNotFoundException;
import com.bank.management.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Cuentas", description = "Puntos finales de gestión de cuentas")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/all")
    @Operation(summary = "Obtener todas las cuenta",
            description = "Devuelve una lista de todas las cuentas")
    public ResponseEntity<List<AccountDTO>> getAccount() {
        return ResponseEntity.ok(accountService.getAll());
    }

    @PostMapping
    @Operation(summary = "Crear una nueva cuenta", description = "Crea una nueva cuenta")
    public ResponseEntity<AccountDTO> saveAccount(
            @Valid @RequestBody CreateAccountDTO createAccountDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(accountService.save(createAccountDTO));
    }
    

    @GetMapping("/byNumber/{accountNumber}")
    @Operation(summary = "Obtener cuenta por número",
            description = "Devuelve los detalles de la cuenta según el número de cuenta (DNI)")
    public ResponseEntity<AccountDTO> getAccountByNumber(@PathVariable String accountNumber) {
        try {
            AccountDTO account = accountService.getByAccountNumber(accountNumber);
            return ResponseEntity.ok(account);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener cuenta por ID",
            description = "Devuelve los detalles de la cuenta seghun el ID")
    public ResponseEntity<AccountDTO> getOperationsById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getById(id));
    }

    @PutMapping("/update")
    @Operation(summary = "Actualizar cuenta",
            description = "Actualiza los detalles de una cuenta existente")
    public ResponseEntity<AccountDTO> updateAccount(
            @Valid @RequestBody UpdateAccountDTO updateAccountDTO) {
        return ResponseEntity.ok(accountService.update(updateAccountDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar cuenta", description = "Elimina una cuenta según el ID")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
