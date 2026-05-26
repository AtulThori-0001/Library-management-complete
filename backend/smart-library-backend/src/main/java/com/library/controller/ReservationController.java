package com.library.controller;

import com.library.dto.request.ReservationRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.PageResponse;
import com.library.dto.response.ReservationResponse;
import com.library.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservations", description = "Book reservation management")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @Operation(summary = "Reserve a Book")
    public ResponseEntity<ApiResponse<ReservationResponse>> makeReservation(
            @Valid @RequestBody ReservationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Book reserved successfully",
                reservationService.makeReservation(request, userDetails.getUsername())));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel Reservation")
    public ResponseEntity<ApiResponse<ReservationResponse>> cancelReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Reservation cancelled",
                reservationService.cancelReservation(id, userDetails.getUsername())));
    }

    @PutMapping("/{id}/fulfill")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Fulfill Reservation (Admin)")
    public ResponseEntity<ApiResponse<ReservationResponse>> fulfillReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Reservation fulfilled and book issued",
                reservationService.fulfillReservation(id, userDetails.getUsername())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get All Reservations (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<ReservationResponse>>> getAllReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Reservations fetched",
                reservationService.getAllReservations(PageRequest.of(page, size))));
    }

    @GetMapping("/my")
    @Operation(summary = "Get My Reservations")
    public ResponseEntity<ApiResponse<PageResponse<ReservationResponse>>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Your reservations",
                reservationService.getMyReservations(userDetails.getUsername(), PageRequest.of(page, size))));
    }
}
