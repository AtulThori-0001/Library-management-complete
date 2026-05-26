package com.library.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReturnBookRequest {
    @NotNull(message = "Transaction ID is required")
    private Long transactionId;
    private String remarks;
    private Boolean waiveFine = false;
}
