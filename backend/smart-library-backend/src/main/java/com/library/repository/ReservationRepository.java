package com.library.repository;

import com.library.entity.Reservation;
import com.library.entity.ReservationStatus;
import com.library.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Page<Reservation> findByUser(User user, Pageable pageable);
    Page<Reservation> findByStatus(ReservationStatus status, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.book.id = :bookId AND r.status = 'PENDING'")
    Optional<Reservation> findPendingReservation(@Param("userId") Long userId, @Param("bookId") Long bookId);

    @Query("SELECT r FROM Reservation r WHERE r.expiryDate < :today AND r.status = 'PENDING'")
    List<Reservation> findExpiredReservations(@Param("today") LocalDate today);

    @Query("SELECT r FROM Reservation r WHERE r.book.id = :bookId AND r.status = 'PENDING' ORDER BY r.reservationDate ASC")
    List<Reservation> findPendingByBook(@Param("bookId") Long bookId);

    Long countByStatus(ReservationStatus status);
}
