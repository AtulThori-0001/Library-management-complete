package com.library.controller;

import com.library.dto.request.IssueBookRequest;
import com.library.dto.request.ReturnBookRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.PageResponse;
import com.library.dto.response.TransactionResponse;
import com.library.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Book issue and return management")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Issue Book", description = "Issue a book to a student (Admin only)")
    public ResponseEntity<ApiResponse<TransactionResponse>> issueBook(
            @Valid @RequestBody IssueBookRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Book issued successfully",
                transactionService.issueBook(request, userDetails.getUsername())));
    }

    @PostMapping("/return")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Return Book", description = "Process book return (Admin only)")
    public ResponseEntity<ApiResponse<TransactionResponse>> returnBook(
            @Valid @RequestBody ReturnBookRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Book returned successfully",
                transactionService.returnBook(request, userDetails.getUsername())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get All Transactions")
    public ResponseEntity<ApiResponse<PageResponse<TransactionResponse>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Transactions fetched",
                transactionService.getAllTransactions(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Transaction by ID")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Transaction fetched",
                transactionService.getTransactionById(id)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Transactions by User")
    public ResponseEntity<ApiResponse<PageResponse<TransactionResponse>>> getByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Transactions fetched",
                transactionService.getTransactionsByUser(userId, PageRequest.of(page, size))));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Active Issues")
    public ResponseEntity<ApiResponse<PageResponse<TransactionResponse>>> getActiveIssues(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Active issues fetched",
                transactionService.getActiveIssues(PageRequest.of(page, size))));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Overdue Transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getOverdue() {
        return ResponseEntity.ok(ApiResponse.success("Overdue transactions",
                transactionService.getOverdueTransactions()));
    }

    @GetMapping("/my-books")
    @Operation(summary = "Get My Issued Books", description = "Get books currently issued to the logged-in student")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getMyBooks(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Your books",
                transactionService.getMyTransactions(userDetails.getUsername())));
    }

    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Download PDF Report")
    public ResponseEntity<byte[]> downloadReport(@RequestParam(defaultValue = "all") String type) {
        byte[] pdf = transactionService.generateTransactionReport(type);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=library-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
