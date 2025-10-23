package com.bank.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dni;
    private String name;
    private String email;
    private String password;


    @OneToMany(mappedBy = "user",
            cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Account> accounts;

    // El resto de la relación (operaciones)
    @OneToMany(mappedBy = "users") // Nota: Si tu campo en Operations.java es 'users', déjalo así.
    @JsonIgnore
    private List<Operations> operations;

    public Double getPrincipalAccountSaldo() {
    if (this.accounts != null && !this.accounts.isEmpty()) {
        // Asume que la primera cuenta en la lista es la principal
        return this.accounts.get(0).getSaldo();
    }
    return null;
}

public String getPrincipalAccountNumber() {
        if (this.accounts != null && !this.accounts.isEmpty()) {
            return this.accounts.get(0).getAccountNumber();
        }
        return null;
    }
}
