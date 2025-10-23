package com.bank.management.repository;

import com.bank.management.entity.Users;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    // 1. Método para verificar si el DNI ya existe (Ya lo tenías)
    boolean existsByDni(String dni);

    // 2. 🚨 CRÍTICO: Método para verificar si el EMAIL ya existe (FALTANTE)
    boolean existsByEmail(String email);

    // 3. Método para la autenticación (Ya lo tenías)
    Optional<Users> findByEmail(String email);

    Optional<Users> findByDni(String dni);

}
