package com.library.repository;

import com.library.entity.Fine;
import com.library.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    Page<Fine> findByUser(User user, Pageable pageable);
    List<Fine> findByUserAndIsPaid(User user, Boolean isPaid);

    @Query("SELECT SUM(f.fineAmount) FROM Fine f WHERE f.isPaid = false")
    BigDecimal getTotalOutstandingFines();

    @Query("SELECT SUM(f.fineAmount) FROM Fine f WHERE f.user.id = :userId AND f.isPaid = false")
    BigDecimal getOutstandingFinesByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM Fine f WHERE f.isPaid = false")
    Long countUnpaidFines();
}
