package com.library.service.impl;

import com.library.dto.request.ReservationRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.ReservationResponse;
import com.library.entity.*;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import com.library.repository.UserRepository;
import com.library.dto.request.IssueBookRequest;
import com.library.service.ReservationService;
import com.library.service.TransactionService;
import com.library.util.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;
    private final TransactionService transactionService;

    @Override
    @Transactional
    public ReservationResponse makeReservation(ReservationRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", request.getBookId()));
        if (reservationRepository.findPendingReservation(user.getId(), book.getId()).isPresent())
            throw new BadRequestException("You already have a pending reservation for this book");
        // Allow reservation even if copies are available, as per user requirement.
        Reservation reservation = Reservation.builder()
                .user(user).book(book).status(ReservationStatus.PENDING)
                .reservationDate(LocalDate.now()).expiryDate(LocalDate.now().plusDays(7))
                .remarks(request.getRemarks()).build();
        reservationRepository.save(reservation);
        emailService.sendReservationEmail(user.getEmail(),
                user.getFirstName() + " " + user.getLastName(), book.getTitle());
        return mapToResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse cancelReservation(Long id, String username) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
        
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!reservation.getUser().getUsername().equals(username) && !currentUser.getRole().name().equals("ROLE_ADMIN"))
            throw new BadRequestException("You can only cancel your own reservations");
            
        if (!ReservationStatus.PENDING.equals(reservation.getStatus()))
            throw new BadRequestException("Only pending reservations can be cancelled");
        reservation.setStatus(ReservationStatus.CANCELLED);
        return mapToResponse(reservationRepository.save(reservation));
    }

    @Override
    @Transactional
    public ReservationResponse fulfillReservation(Long id, String adminUsername) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation", "id", id));
        
        // Issue the book when fulfilling the reservation
        IssueBookRequest issueRequest = new IssueBookRequest();
        issueRequest.setUserId(reservation.getUser().getId());
        issueRequest.setBookId(reservation.getBook().getId());
        issueRequest.setRemarks("Issued from Reservation #" + reservation.getId());
        issueRequest.setIssueDays(14); // Default issue days
        transactionService.issueBook(issueRequest, adminUsername);
        
        reservation.setStatus(ReservationStatus.FULFILLED);
        return mapToResponse(reservationRepository.save(reservation));
    }

    @Override
    public PageResponse<ReservationResponse> getAllReservations(Pageable pageable) {
        return toPageResponse(reservationRepository.findAll(pageable));
    }

    @Override
    public PageResponse<ReservationResponse> getMyReservations(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return toPageResponse(reservationRepository.findByUser(user, pageable));
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 1 * * *")
    public void processExpiredReservations() {
        List<Reservation> expired = reservationRepository.findExpiredReservations(LocalDate.now());
        expired.forEach(r -> r.setStatus(ReservationStatus.EXPIRED));
        reservationRepository.saveAll(expired);
    }

    private PageResponse<ReservationResponse> toPageResponse(Page<Reservation> page) {
        return PageResponse.<ReservationResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber()).size(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).first(page.isFirst()).build();
    }

    public ReservationResponse mapToResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId()).userId(r.getUser().getId())
                .userName(r.getUser().getFirstName() + " " + r.getUser().getLastName())
                .bookId(r.getBook().getId()).bookTitle(r.getBook().getTitle())
                .bookIsbn(r.getBook().getIsbn()).status(r.getStatus())
                .reservationDate(r.getReservationDate()).expiryDate(r.getExpiryDate())
                .remarks(r.getRemarks()).createdAt(r.getCreatedAt()).build();
    }
}
