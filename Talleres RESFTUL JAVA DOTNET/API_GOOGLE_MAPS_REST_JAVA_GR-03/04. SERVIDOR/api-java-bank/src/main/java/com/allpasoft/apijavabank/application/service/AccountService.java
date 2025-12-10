package com.allpasoft.apijavabank.application.service;

import com.allpasoft.apijavabank.application.dto.AccountDto;
import com.allpasoft.apijavabank.application.dto.CreateAccountDto;
import com.allpasoft.apijavabank.application.dto.UpdateAccountDto;
import com.allpasoft.apijavabank.domain.entity.Account;
import com.allpasoft.apijavabank.domain.entity.AccountType;
import com.allpasoft.apijavabank.domain.entity.User;
import com.allpasoft.apijavabank.domain.repository.AccountRepository;
import com.allpasoft.apijavabank.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public Optional<AccountDto> getById(Long id) {
        return accountRepository.findById(id).map(this::toDto);
    }

    public List<AccountDto> getByUserId(Long userId) {
        return accountRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AccountDto> getAll() {
        return accountRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<AccountDto> create(CreateAccountDto dto) {
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType(AccountType.values()[dto.getAccountType()]);
        account.setBalance(dto.getInitialBalance());
        account.setIsActive(true);
        account.setUserId(dto.getUserId());
        account.setCreatedAt(LocalDateTime.now());

        Account saved = accountRepository.save(account);
        saved.setUser(userOpt.get());
        return Optional.of(toDto(saved));
    }

    @Transactional
    public Optional<AccountDto> update(Long id, UpdateAccountDto dto) {
        Optional<Account> accountOpt = accountRepository.findById(id);
        if (accountOpt.isEmpty()) {
            return Optional.empty();
        }

        Account account = accountOpt.get();
        account.setIsActive(dto.getIsActive());
        account.setUpdatedAt(LocalDateTime.now());

        Account saved = accountRepository.save(account);
        return Optional.of(toDto(saved));
    }

    @Transactional
    public boolean delete(Long id) {
        if (!accountRepository.existsById(id)) {
            return false;
        }
        accountRepository.deleteById(id);
        return true;
    }

    private String generateAccountNumber() {
        Random random = new Random();
        return String.format("%04d-%04d-%04d",
                random.nextInt(9000) + 1000,
                random.nextInt(9000) + 1000,
                random.nextInt(9000) + 1000);
    }

    private AccountDto toDto(Account account) {
        String userFullName = "";
        if (account.getUser() != null) {
            userFullName = account.getUser().getFirstName() + " " + account.getUser().getLastName();
        }

        return new AccountDto(
                account.getId(),
                account.getAccountNumber(),
                account.getAccountType().ordinal(),
                account.getBalance(),
                account.getIsActive(),
                account.getUserId(),
                userFullName,
                account.getCreatedAt(),
                account.getUpdatedAt()
        );
    }
}
