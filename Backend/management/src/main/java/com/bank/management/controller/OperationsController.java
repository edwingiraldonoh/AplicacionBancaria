package com.bank.management.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.bank.management.dto.request.CreateOperationsDTO;
import com.bank.management.dto.request.TransactionRequestDTO;
import com.bank.management.dto.request.UpdateOperationsDTO;
import com.bank.management.dto.response.OperationsDTO;
import com.bank.management.service.OperationsService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/operations")
@CrossOrigin(origins = "http://localhost:3000")
public class OperationsController {
    private final OperationsService operationsService;

    public OperationsController(OperationsService operationsService) {
        this.operationsService = operationsService;
    }

    @GetMapping("/all")
    @Operation(summary = "Obtener todas las operaciones",
            description = "Devuelve una lista de todas las cuentas")
    public ResponseEntity<List<OperationsDTO>> getOperations() {
        return ResponseEntity.ok(operationsService.getAll());
    }

    @PostMapping
    @Operation(summary = "Crear una nueva operacion", description = "Crea una nueva operacion")
    public ResponseEntity<OperationsDTO> saveOperations(
            @Valid @RequestBody CreateOperationsDTO createOperationsDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(operationsService.save(createOperationsDTO));
    }

    @PostMapping("/transaction")
    @Operation(summary = "Realizar una transacción", description = "Realiza un depósito o retiro")
    public ResponseEntity<Void> performTransaction(
            @Valid @RequestBody TransactionRequestDTO transactionRequestDTO) {
        System.out
                .println("✅ TRANSACTION RECEIVED - From: " + transactionRequestDTO.getFromAccount()
                        + ", To: " + transactionRequestDTO.getToAccount() + ", Amount: "
                        + transactionRequestDTO.getAmount());

        try {
            operationsService.performTransaction(transactionRequestDTO);
            System.out.println("✅ TRANSACTION SUCCESS");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("❌ TRANSACTION ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener operacion por ID",
            description = "Devuelve los detalles de la operacion segun el ID")
    public ResponseEntity<OperationsDTO> getOperationsById(@PathVariable Long id) {
        return ResponseEntity.ok(operationsService.getById(id));
    }

    @PutMapping("/update")
    @Operation(summary = "Actualizar operacion",
            description = "Actualiza los detalles de la operacion")
    public ResponseEntity<OperationsDTO> updateOperations(
            @Valid @RequestBody UpdateOperationsDTO updateOperationsDTO) {
        return ResponseEntity.ok(operationsService.update(updateOperationsDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar operacion", description = "Elimina una operacion según el ID")
    public ResponseEntity<Void> deleteOperations(@PathVariable Long id) {
        operationsService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
