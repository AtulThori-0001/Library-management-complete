package com.library.service;

import com.library.dto.request.ReservationRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.ReservationResponse;
import org.springframework.data.domain.Pageable;

public interface ReservationService {
    ReservationResponse makeReservation(ReservationRequest request, String username);
    ReservationResponse cancelReservation(Long id, String username);
    ReservationResponse fulfillReservation(Long id, String adminUsername);
    PageResponse<ReservationResponse> getAllReservations(Pageable pageable);
    PageResponse<ReservationResponse> getMyReservations(String username, Pageable pageable);
    void processExpiredReservations();
}
