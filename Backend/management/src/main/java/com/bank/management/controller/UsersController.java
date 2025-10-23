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
import com.bank.management.dto.request.CreateUsersDTO;
import com.bank.management.dto.request.LoginRequest;
import com.bank.management.dto.request.UpdateUsersDTO;
import com.bank.management.dto.response.UsersDTO;
import com.bank.management.entity.Users;
import com.bank.management.service.UsersService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {
    private final UsersService usersService;

    // Este es tu método de login, que ya debería funcionar
    @PostMapping("/login")
public ResponseEntity<UsersDTO> loginUser(@RequestBody LoginRequest loginRequest) { // <-- Arreglado
    UsersDTO userDto = usersService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
    return ResponseEntity.ok(userDto);
}

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/all")
    @Operation(summary = "Obtener todos los usuarios",
            description = "Devuelve una lista de todos los usuarios")
    public ResponseEntity<List<UsersDTO>> getUsers() {
        return ResponseEntity.ok(usersService.getAll());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo usuario", description = "Crea un nuevo usuario")
    public ResponseEntity<UsersDTO> saveUsers(
            @Valid @RequestBody CreateUsersDTO createUsersDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usersService.save(createUsersDTO));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID",
            description = "Devuelve los detalles del usuario segun el ID")
    public ResponseEntity<UsersDTO> getUsersById(@PathVariable Long id) {
        return ResponseEntity.ok(usersService.getById(id));
    }

    @PutMapping("/update")
    @Operation(summary = "Actualizar usuario",
            description = "Actualiza los detalles de un usuario existente")
    public ResponseEntity<UsersDTO> updateUsers(@Valid @RequestBody UpdateUsersDTO updateUsersDTO) {
        return ResponseEntity.ok(usersService.update(updateUsersDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario según el ID")
    public ResponseEntity<Void> deleteUsers(@PathVariable Long id) {
        usersService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
