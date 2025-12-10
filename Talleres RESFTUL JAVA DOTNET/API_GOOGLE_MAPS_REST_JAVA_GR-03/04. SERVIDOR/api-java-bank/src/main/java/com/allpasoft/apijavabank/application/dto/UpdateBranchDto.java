package com.allpasoft.apijavabank.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBranchDto {
    private String name;
    private Double latitude;
    private Double longitude;
    private String phoneNumber;
    private String email;
    private Boolean isActive;
}
