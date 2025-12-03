package com.allpasoft.apijavabank.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    private Long id;
    private Integer transactionType;
    private BigDecimal amount;
    private String description;
    private Long accountId;
    private String accountNumber;
    private Long destinationAccountId;
    private String destinationAccountNumber;
    private LocalDateTime createdAt;
}
