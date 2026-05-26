package com.library.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FineResponse {
    private Long id;
    private Long transactionId;
    private Long userId;
    private String userName;
    private String bookTitle;
    private BigDecimal fineAmount;
    private Integer daysOverdue;
    private Boolean isPaid;
    private LocalDateTime paidAt;
    private String remarks;
    private LocalDateTime createdAt;
}
