package com.library.repository;

import com.library.entity.Transaction;
import com.library.entity.TransactionType;
import com.library.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByUser(User user, Pageable pageable);
    Page<Transaction> findByTransactionType(TransactionType type, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = 'ISSUE' AND t.returnDate IS NULL")
    List<Transaction> findActiveIssuesByUser(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.book.id = :bookId AND t.transactionType = 'ISSUE' AND t.returnDate IS NULL")
    Optional<Transaction> findActiveIssueByBook(@Param("bookId") Long bookId);

    @Query("SELECT t FROM Transaction t WHERE t.dueDate < :today AND t.returnDate IS NULL AND t.transactionType = 'ISSUE'")
    List<Transaction> findOverdueTransactions(@Param("today") LocalDate today);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.dueDate < :today AND t.returnDate IS NULL")
    List<Transaction> findOverdueByUser(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.transactionType = 'ISSUE' AND t.returnDate IS NULL")
    Long countCurrentlyIssuedBooks();

    @Query("SELECT SUM(t.fineAmount) FROM Transaction t WHERE t.user.id = :userId AND t.finePaid = false")
    Optional<BigDecimal> getTotalUnpaidFineByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :from")
    Long countTransactionsSince(@Param("from") java.time.LocalDateTime from);

    @Query("SELECT t FROM Transaction t WHERE t.transactionType = 'ISSUE' AND t.returnDate IS NULL ORDER BY t.issueDate ASC")
    Page<Transaction> findAllActiveIssues(Pageable pageable);
}
