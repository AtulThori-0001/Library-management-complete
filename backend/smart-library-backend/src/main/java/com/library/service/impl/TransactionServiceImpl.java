package com.library.service.impl;

import com.library.dto.request.IssueBookRequest;
import com.library.dto.request.ReturnBookRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.TransactionResponse;
import com.library.entity.*;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.TransactionRepository;
import com.library.repository.UserRepository;
import com.library.service.TransactionService;
import com.library.util.EmailService;
import com.library.util.FineCalculator;
import com.library.util.PdfReportGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final FineCalculator fineCalculator;
    private final EmailService emailService;
    private final PdfReportGenerator pdfReportGenerator;

    @Override
    @Transactional
    public TransactionResponse issueBook(IssueBookRequest request, String adminUsername) {
        User student = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getUserId()));
        if (!student.getIsActive())
            throw new BadRequestException("Student account is inactive");

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", request.getBookId()));
        if (book.getAvailableCopies() <= 0)
            throw new BadRequestException("No copies of this book are currently available");

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "username", adminUsername));

        int issueDays = request.getIssueDays() != null ? request.getIssueDays() : 14;
        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(issueDays);

        Transaction transaction = Transaction.builder()
                .user(student).book(book)
                .transactionType(TransactionType.ISSUE)
                .issueDate(issueDate).dueDate(dueDate)
                .issuedBy(admin).remarks(request.getRemarks())
                .fineAmount(BigDecimal.ZERO).finePaid(false).build();
        transactionRepository.save(transaction);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        if (book.getAvailableCopies() == 0) book.setStatus(BookStatus.ISSUED);
        bookRepository.save(book);

        emailService.sendBookIssuedEmail(student.getEmail(),
                student.getFirstName() + " " + student.getLastName(),
                book.getTitle(), dueDate.toString());

        return mapToResponse(transaction);
    }

    @Override
    @Transactional
    public TransactionResponse returnBook(ReturnBookRequest request, String adminUsername) {
        Transaction transaction = transactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", request.getTransactionId()));
        if (transaction.getReturnDate() != null)
            throw new BadRequestException("This book has already been returned");
        if (!TransactionType.ISSUE.equals(transaction.getTransactionType()))
            throw new BadRequestException("Invalid transaction type for return");

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "username", adminUsername));

        LocalDate returnDate = LocalDate.now();
        BigDecimal fine = Boolean.TRUE.equals(request.getWaiveFine()) ? BigDecimal.ZERO
                : fineCalculator.calculateFine(transaction.getDueDate(), returnDate);

        transaction.setReturnDate(returnDate);
        transaction.setFineAmount(fine);
        transaction.setFinePaid(fine.compareTo(BigDecimal.ZERO) == 0);
        transaction.setReturnedTo(admin);
        if (request.getRemarks() != null) transaction.setRemarks(request.getRemarks());
        transactionRepository.save(transaction);

        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        book.setStatus(BookStatus.AVAILABLE);
        bookRepository.save(book);

        User student = transaction.getUser();
        emailService.sendReturnConfirmationEmail(student.getEmail(),
                student.getFirstName() + " " + student.getLastName(),
                book.getTitle(), fine.doubleValue());

        return mapToResponse(transaction);
    }

    @Override
    public TransactionResponse getTransactionById(Long id) {
        return mapToResponse(transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id)));
    }

    @Override
    public PageResponse<TransactionResponse> getAllTransactions(Pageable pageable) {
        return toPageResponse(transactionRepository.findAll(pageable));
    }

    @Override
    public PageResponse<TransactionResponse> getTransactionsByUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return toPageResponse(transactionRepository.findByUser(user, pageable));
    }

    @Override
    public PageResponse<TransactionResponse> getActiveIssues(Pageable pageable) {
        return toPageResponse(transactionRepository.findAllActiveIssues(pageable));
    }

    @Override
    public List<TransactionResponse> getOverdueTransactions() {
        return transactionRepository.findOverdueTransactions(LocalDate.now())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getMyTransactions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return transactionRepository.findActiveIssuesByUser(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public byte[] generateTransactionReport(String type) {
        try {
            List<Transaction> transactions;
            String title;
            if ("overdue".equalsIgnoreCase(type)) {
                transactions = transactionRepository.findOverdueTransactions(LocalDate.now());
                title = "Overdue Books Report";
            } else {
                transactions = transactionRepository.findAll();
                title = "All Transactions Report";
            }
            return pdfReportGenerator.generateTransactionReport(
                    transactions.stream().map(this::mapToResponse).collect(Collectors.toList()), title);
        } catch (Exception e) {
            log.error("Error generating report: {}", e.getMessage());
            throw new BadRequestException("Could not generate report: " + e.getMessage());
        }
    }

    private PageResponse<TransactionResponse> toPageResponse(Page<Transaction> page) {
        return PageResponse.<TransactionResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber()).size(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).first(page.isFirst()).build();
    }

    public TransactionResponse mapToResponse(Transaction t) {
        boolean overdue = t.getReturnDate() == null && t.getDueDate() != null && LocalDate.now().isAfter(t.getDueDate());
        long daysOverdue = overdue && t.getDueDate() != null ? ChronoUnit.DAYS.between(t.getDueDate(), LocalDate.now()) : 0;
        return TransactionResponse.builder()
                .id(t.getId())
                .userId(t.getUser().getId())
                .userName(t.getUser().getFirstName() + " " + t.getUser().getLastName())
                .userEmail(t.getUser().getEmail())
                .bookId(t.getBook().getId())
                .bookTitle(t.getBook().getTitle())
                .bookIsbn(t.getBook().getIsbn())
                .transactionType(t.getTransactionType())
                .issueDate(t.getIssueDate()).dueDate(t.getDueDate()).returnDate(t.getReturnDate())
                .fineAmount(t.getFineAmount()).finePaid(t.getFinePaid())
                .remarks(t.getRemarks()).isOverdue(overdue).daysOverdue(daysOverdue)
                .createdAt(t.getCreatedAt()).build();
    }
}
