package com.library.service;

import com.library.dto.request.BookRequest;
import com.library.dto.response.BookResponse;
import com.library.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {
    BookResponse addBook(BookRequest request);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    BookResponse getBookById(Long id);
    BookResponse getBookByIsbn(String isbn);
    PageResponse<BookResponse> getAllBooks(Pageable pageable);
    PageResponse<BookResponse> searchBooks(String keyword, Pageable pageable);
    PageResponse<BookResponse> getBooksByCategory(String category, Pageable pageable);
    List<String> getAllCategories();
    List<BookResponse> getRecentBooks(int limit);
}
