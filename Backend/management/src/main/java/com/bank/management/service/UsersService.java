package com.bank.management.service;

import com.bank.management.dto.request.CreateUsersDTO;
import com.bank.management.dto.request.UpdateUsersDTO;
import com.bank.management.dto.response.UsersDTO;
import com.bank.management.entity.Users;
import java.util.List;

public interface UsersService {
    UsersDTO save(CreateUsersDTO createUsersDTO);
    List<UsersDTO> getAll();
    UsersDTO getById(Long id);
    UsersDTO update(UpdateUsersDTO updateUsersDTO);
    void delete(Long id);
    UsersDTO authenticate(String email, String password);

}
