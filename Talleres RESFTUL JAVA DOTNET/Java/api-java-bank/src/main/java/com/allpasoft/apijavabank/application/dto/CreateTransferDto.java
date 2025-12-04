package com.allpasoft.apijavabank.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransferDto {
    private Long sourceAccountId;
    private Long destinationAccountId;
    private BigDecimal amount;
    private String description;
}
