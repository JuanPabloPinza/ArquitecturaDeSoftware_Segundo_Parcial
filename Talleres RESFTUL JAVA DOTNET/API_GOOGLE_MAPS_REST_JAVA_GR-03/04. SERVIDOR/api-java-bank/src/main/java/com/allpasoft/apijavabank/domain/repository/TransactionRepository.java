package com.allpasoft.apijavabank.domain.repository;

import com.allpasoft.apijavabank.domain.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.accountId = :accountId OR t.destinationAccountId = :accountId ORDER BY t.createdAt DESC")
    List<Transaction> findByAccountIdOrDestinationAccountId(@Param("accountId") Long accountId);
    
    List<Transaction> findAllByOrderByCreatedAtDesc();
}
