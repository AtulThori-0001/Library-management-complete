package com.library.dto.response;

import com.library.entity.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long bookId;
    private String bookTitle;
    private String bookIsbn;
    private TransactionType transactionType;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BigDecimal fineAmount;
    private Boolean finePaid;
    private String remarks;
    private Boolean isOverdue;
    private Long daysOverdue;
    private LocalDateTime createdAt;
}
