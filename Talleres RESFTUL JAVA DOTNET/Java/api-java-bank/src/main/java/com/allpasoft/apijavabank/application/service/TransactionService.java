package com.allpasoft.apijavabank.application.service;

import com.allpasoft.apijavabank.application.dto.*;
import com.allpasoft.apijavabank.domain.entity.Account;
import com.allpasoft.apijavabank.domain.entity.Transaction;
import com.allpasoft.apijavabank.domain.entity.TransactionType;
import com.allpasoft.apijavabank.domain.repository.AccountRepository;
import com.allpasoft.apijavabank.domain.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    public Optional<TransactionDto> getById(Long id) {
        return transactionRepository.findById(id).map(this::toDto);
    }

    public List<TransactionDto> getByAccountId(Long accountId) {
        return transactionRepository.findByAccountIdOrDestinationAccountId(accountId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TransactionDto> getAll() {
        return transactionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<TransactionDto> deposit(CreateDepositDto dto) {
        Optional<Account> accountOpt = accountRepository.findById(dto.getAccountId());
        if (accountOpt.isEmpty() || !accountOpt.get().getIsActive()) {
            return Optional.empty();
        }

        Account account = accountOpt.get();
        account.setBalance(account.getBalance().add(dto.getAmount()));
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.DEPOSIT);
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription() != null ? dto.getDescription() : "Depósito");
        transaction.setAccountId(dto.getAccountId());
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction saved = transactionRepository.save(transaction);
        saved.setAccount(account);
        return Optional.of(toDto(saved));
    }

    @Transactional
    public Optional<TransactionDto> withdraw(CreateWithdrawalDto dto) {
        Optional<Account> accountOpt = accountRepository.findById(dto.getAccountId());
        if (accountOpt.isEmpty() || !accountOpt.get().getIsActive()) {
            return Optional.empty();
        }

        Account account = accountOpt.get();
        if (account.getBalance().compareTo(dto.getAmount()) < 0) {
            return Optional.empty();
        }

        account.setBalance(account.getBalance().subtract(dto.getAmount()));
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.WITHDRAWAL);
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription() != null ? dto.getDescription() : "Retiro");
        transaction.setAccountId(dto.getAccountId());
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction saved = transactionRepository.save(transaction);
        saved.setAccount(account);
        return Optional.of(toDto(saved));
    }

    @Transactional
    public Optional<TransactionDto> transfer(CreateTransferDto dto) {
        Optional<Account> sourceOpt = accountRepository.findById(dto.getSourceAccountId());
        Optional<Account> destOpt = accountRepository.findById(dto.getDestinationAccountId());

        if (sourceOpt.isEmpty() || !sourceOpt.get().getIsActive()) {
            return Optional.empty();
        }
        if (destOpt.isEmpty() || !destOpt.get().getIsActive()) {
            return Optional.empty();
        }

        Account source = sourceOpt.get();
        Account dest = destOpt.get();

        if (source.getBalance().compareTo(dto.getAmount()) < 0) {
            return Optional.empty();
        }

        source.setBalance(source.getBalance().subtract(dto.getAmount()));
        source.setUpdatedAt(LocalDateTime.now());
        dest.setBalance(dest.getBalance().add(dto.getAmount()));
        dest.setUpdatedAt(LocalDateTime.now());

        accountRepository.save(source);
        accountRepository.save(dest);

        Transaction transaction = new Transaction();
        transaction.setTransactionType(TransactionType.TRANSFER);
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription() != null ? dto.getDescription() : "Transferencia");
        transaction.setAccountId(dto.getSourceAccountId());
        transaction.setDestinationAccountId(dto.getDestinationAccountId());
        transaction.setCreatedAt(LocalDateTime.now());

        Transaction saved = transactionRepository.save(transaction);
        saved.setAccount(source);
        saved.setDestinationAccount(dest);
        return Optional.of(toDto(saved));
    }

    private TransactionDto toDto(Transaction transaction) {
        return new TransactionDto(
                transaction.getId(),
                transaction.getTransactionType().ordinal(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getAccountId(),
                transaction.getAccount() != null ? transaction.getAccount().getAccountNumber() : "",
                transaction.getDestinationAccountId(),
                transaction.getDestinationAccount() != null ? transaction.getDestinationAccount().getAccountNumber() : null,
                transaction.getCreatedAt()
        );
    }
}
