package com.library.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private Long totalBooks;
    private Long totalStudents;
    private Long totalAdmins;
    private Long booksIssued;
    private Long booksAvailable;
    private Long overdueBooks;
    private Long totalReservations;
    private Long pendingReservations;
    private BigDecimal totalFinesCollected;
    private BigDecimal totalOutstandingFines;
    private Long totalTransactionsToday;
    private List<BookResponse> recentBooks;
    private List<TransactionResponse> recentTransactions;
    private Map<String, Long> booksByCategory;
}
