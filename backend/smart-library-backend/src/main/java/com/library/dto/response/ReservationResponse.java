package com.library.dto.response;

import com.library.entity.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long bookId;
    private String bookTitle;
    private String bookIsbn;
    private ReservationStatus status;
    private LocalDate reservationDate;
    private LocalDate expiryDate;
    private String remarks;
    private LocalDateTime createdAt;
}
