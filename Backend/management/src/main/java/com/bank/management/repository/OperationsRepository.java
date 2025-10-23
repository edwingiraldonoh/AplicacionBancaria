package com.bank.management.repository;

import com.bank.management.entity.Operations;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface OperationsRepository extends JpaRepository<Operations, Long> {

}