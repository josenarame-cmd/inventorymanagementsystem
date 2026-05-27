package com.jose.group.inventorymanagementsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequest {
    private String email;
    private String purpose; // LOGIN, PASSWORD_RESET, etc.
}
