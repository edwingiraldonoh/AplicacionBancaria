package com.bank.management.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder; // Importante
import org.springframework.stereotype.Service;
import com.bank.management.dto.request.CreateUsersDTO;
import com.bank.management.dto.request.UpdateUsersDTO;
import com.bank.management.dto.response.UsersDTO;
import com.bank.management.exceptions.DataNotFoundException;
import com.bank.management.exceptions.DuplicatedDataException;
import com.bank.management.exceptions.ResourceNotFoundException;
import com.bank.management.mapper.UsersMapper;
import com.bank.management.repository.UsersRepository;
import com.bank.management.service.UsersService;
import com.bank.management.entity.Users;
import com.bank.management.entity.Account;
import com.bank.management.repository.AccountRepository;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UsersServiceImpl implements UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsersMapper usersMapper;
    private final AccountRepository accountRepository;



    public UsersServiceImpl(UsersRepository usersRepository, PasswordEncoder passwordEncoder,
            UsersMapper Mapper, AccountRepository accountRepository) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.usersMapper = Mapper;
        this.accountRepository = accountRepository;

    }



    @Override
    @Transactional // Asegura que el registro de usuario y cuenta sea una sola operación atómica
    public UsersDTO save(CreateUsersDTO createUsersDTO) {
        // 1. Validar duplicados
        if (usersRepository.findByDni(createUsersDTO.getDni()).isPresent()) {
            throw new DuplicatedDataException("Users", createUsersDTO.getDni());
        }
        if (usersRepository.findByEmail(createUsersDTO.getEmail()).isPresent()) {
            throw new DuplicatedDataException("Users", createUsersDTO.getEmail());
        }

        // 2. DECLARAR e INICIALIZAR la entidad 'user'
        // ⬇️ ¡SOLUCIÓN para el error 'cannot find symbol: variable user' en la línea 43!
        Users user = usersMapper.toEntity(createUsersDTO);
        user.setPassword(passwordEncoder.encode(createUsersDTO.getPassword()));

        // 3. Guardar el User
        Users savedUser = usersRepository.save(user);

        // 4. Crear la Account Principal (Lógica de tu negocio)
        Account principalAccount = new Account();
        principalAccount.setAccountNumber(savedUser.getDni());
        principalAccount.setSaldo(100000.00);
        principalAccount.setAccountType("Cuenta Principal");
        principalAccount.setUser(savedUser);

        Account savedAccount = accountRepository.save(principalAccount);

        // 5. Establecer la relación bidireccional (CRÍTICO para que el DTO funcione)
        if (savedUser.getAccounts() == null) {
            savedUser.setAccounts(new ArrayList<>());
        }
        savedUser.getAccounts().add(savedAccount);

        return usersMapper.toDTO(savedUser);
    }


    private String createAccountNumber(String dni) {
        // Implementación de ejemplo para generar un número único
        // Se recomienda usar algo más robusto, pero esto sirve para probar.
        return "4050-" + dni.substring(0, Math.min(dni.length(), 6)) + "-"
                + System.currentTimeMillis() % 1000;
    }

    @Override
    public List<UsersDTO> getAll() {
        return usersRepository.findAll().stream().map(users -> usersMapper.toDTO(users)).toList();
    }


    @Override
    @Transactional(readOnly = true) // 1. CRÍTICO: Abre la sesión JPA para permitir la carga LAZY
    public UsersDTO getById(Long id) {

        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(id, "Users"));

        // 2. 🚨 CRÍTICO: Forzar la inicialización de la colección 'accounts' (Lazy Loading)
        if (user.getAccounts() != null) {
            user.getAccounts().size(); // Inicializa la lista leyendo su tamaño
        }

        // 3. Ahora el mapeador puede acceder a los datos de la cuenta sin excepción.
        return usersMapper.toDTO(user);
    }

    @Override
    public UsersDTO update(UpdateUsersDTO updateUsersDTO) {
        Users users = usersRepository.findById(updateUsersDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró la cuenta con id " + updateUsersDTO.getId()));

        usersMapper.updateEntity(users, updateUsersDTO);
        Users updated = usersRepository.save(users);
        return usersMapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        if (!usersRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "No se puede eliminar. El usuario con id " + id + " no existe.");
        }
        usersRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true) // ⬅️ 'readOnly = true' está BIEN aquí
    public UsersDTO authenticate(String email, String password) {
        // 1. Buscar al usuario
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email o contraseña incorrectos"));

        // 2. Validar la contraseña
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResourceNotFoundException("Email o contraseña incorrectos");
        }

        // 3. Forzar carga LAZY (igual que en getById) antes de mapear
        //    Esto es necesario para que el mapper 'toDTO' pueda leer las cuentas.
        if (user.getAccounts() != null) {
            user.getAccounts().size();
        }

        // 4. Mapear y devolver el DTO
        return usersMapper.toDTO(user);
    }
}
