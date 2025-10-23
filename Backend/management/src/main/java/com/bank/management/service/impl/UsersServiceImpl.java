package com.bank.management.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Transactional 
    public UsersDTO save(CreateUsersDTO createUsersDTO) {

        if (usersRepository.findByDni(createUsersDTO.getDni()).isPresent()) {
            throw new DuplicatedDataException("Users", createUsersDTO.getDni());
        }
        if (usersRepository.findByEmail(createUsersDTO.getEmail()).isPresent()) {
            throw new DuplicatedDataException("Users", createUsersDTO.getEmail());
        }
        Users user = usersMapper.toEntity(createUsersDTO);
        user.setPassword(passwordEncoder.encode(createUsersDTO.getPassword()));

        Users savedUser = usersRepository.save(user);

        Account principalAccount = new Account();
        principalAccount.setAccountNumber(savedUser.getDni());
        principalAccount.setSaldo(100000.00);
        principalAccount.setAccountType("Cuenta Principal");
        principalAccount.setUser(savedUser);

        Account savedAccount = accountRepository.save(principalAccount);

        if (savedUser.getAccounts() == null) {
            savedUser.setAccounts(new ArrayList<>());
        }
        savedUser.getAccounts().add(savedAccount);

        return usersMapper.toDTO(savedUser);
    }


    /*private String createAccountNumber(String dni) {
        return "4050-" + dni.substring(0, Math.min(dni.length(), 6)) + "-"
                + System.currentTimeMillis() % 1000;
    }*/

    @Override
    public List<UsersDTO> getAll() {
        return usersRepository.findAll().stream().map(users -> usersMapper.toDTO(users)).toList();
    }


    @Override
    @Transactional(readOnly = true)
    public UsersDTO getById(Long id) {

        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException(id, "Users"));

        if (user.getAccounts() != null) {
            user.getAccounts().size();
        }

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
    @Transactional(readOnly = true)
    public UsersDTO authenticate(String email, String password) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResourceNotFoundException("Email o contraseña incorrectos");
        }

        if (user.getAccounts() != null) {
            user.getAccounts().size();
        }

        return usersMapper.toDTO(user);
    }
}
