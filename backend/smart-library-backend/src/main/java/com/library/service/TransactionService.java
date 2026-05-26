package com.library.service;

import com.library.dto.request.IssueBookRequest;
import com.library.dto.request.ReturnBookRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.TransactionResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TransactionService {
    TransactionResponse issueBook(IssueBookRequest request, String adminUsername);
    TransactionResponse returnBook(ReturnBookRequest request, String adminUsername);
    TransactionResponse getTransactionById(Long id);
    PageResponse<TransactionResponse> getAllTransactions(Pageable pageable);
    PageResponse<TransactionResponse> getTransactionsByUser(Long userId, Pageable pageable);
    PageResponse<TransactionResponse> getActiveIssues(Pageable pageable);
    List<TransactionResponse> getOverdueTransactions();
    List<TransactionResponse> getMyTransactions(String username);
    byte[] generateTransactionReport(String type);
}
