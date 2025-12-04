package com.allpasoft.apijavabank.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountDto {
    private Integer accountType;
    private BigDecimal initialBalance;
    private Long userId;
}
