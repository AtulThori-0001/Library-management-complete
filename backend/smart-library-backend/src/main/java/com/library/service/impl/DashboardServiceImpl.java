package com.library.service.impl;

import com.library.dto.response.DashboardResponse;
import com.library.entity.BookStatus;
import com.library.entity.ReservationStatus;
import com.library.entity.Role;
import com.library.repository.*;
import com.library.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final ReservationRepository reservationRepository;
    private final FineRepository fineRepository;
    private final BookServiceImpl bookService;
    private final TransactionServiceImpl transactionService;

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public DashboardResponse getDashboardStats() {
        BigDecimal totalFines = fineRepository.getTotalOutstandingFines();
        BigDecimal outstanding = fineRepository.getOutstandingFinesByUser(0L);

        Map<String, Long> categoryMap = new LinkedHashMap<>();
        bookRepository.countBooksByCategory().forEach(row ->
                categoryMap.put((String) row[0], (Long) row[1]));

        return DashboardResponse.builder()
                .totalBooks(bookRepository.count())
                .totalStudents(userRepository.countActiveByRole(Role.ROLE_STUDENT))
                .totalAdmins(userRepository.countActiveByRole(Role.ROLE_ADMIN))
                .booksIssued(transactionRepository.countCurrentlyIssuedBooks())
                .booksAvailable(bookRepository.countByStatus(BookStatus.AVAILABLE))
                .overdueBooks((long) transactionRepository.findOverdueTransactions(LocalDate.now()).size())
                .totalReservations(reservationRepository.count())
                .pendingReservations(reservationRepository.countByStatus(ReservationStatus.PENDING))
                .totalFinesCollected(totalFines != null ? totalFines : BigDecimal.ZERO)
                .totalOutstandingFines(outstanding != null ? outstanding : BigDecimal.ZERO)
                .totalTransactionsToday(transactionRepository.countTransactionsSince(LocalDateTime.now().toLocalDate().atStartOfDay()))
                .recentBooks(bookRepository.findRecentBooks(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                        .stream().map(bookService::mapToResponse).toList())
                .recentTransactions(transactionRepository.findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                        .stream().map(transactionService::mapToResponse).toList())
                .booksByCategory(categoryMap)
                .build();
    }
}
