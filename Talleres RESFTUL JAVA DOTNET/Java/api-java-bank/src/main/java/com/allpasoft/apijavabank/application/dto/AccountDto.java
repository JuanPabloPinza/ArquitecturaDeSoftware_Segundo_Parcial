package com.allpasoft.apijavabank.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
    private Long id;
    private String accountNumber;
    private Integer accountType;
    private BigDecimal balance;
    private Boolean isActive;
    private Long userId;
    private String userFullName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
