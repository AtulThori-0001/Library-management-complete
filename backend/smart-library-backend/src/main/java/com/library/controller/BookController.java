package com.library.controller;

import com.library.dto.request.BookRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.BookResponse;
import com.library.dto.response.PageResponse;
import com.library.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Book management endpoints")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get All Books", description = "Retrieve all books with pagination and sorting")
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageResponse<BookResponse> books = bookService.getAllBooks(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Books fetched successfully", books));
    }

    @GetMapping("/search")
    @Operation(summary = "Search Books", description = "Search books by title, author, ISBN, category")
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Search results",
                bookService.searchBooks(keyword, PageRequest.of(page, size))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Book by ID")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Book fetched", bookService.getBookById(id)));
    }

    @GetMapping("/isbn/{isbn}")
    @Operation(summary = "Get Book by ISBN")
    public ResponseEntity<ApiResponse<BookResponse>> getBookByIsbn(@PathVariable String isbn) {
        return ResponseEntity.ok(ApiResponse.success("Book fetched", bookService.getBookByIsbn(isbn)));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get All Categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories fetched", bookService.getAllCategories()));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get Books by Category")
    public ResponseEntity<ApiResponse<PageResponse<BookResponse>>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Books by category",
                bookService.getBooksByCategory(category, PageRequest.of(page, size))));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get Recent Books")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getRecentBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success("Recent books", bookService.getRecentBooks(limit)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add Book", description = "Add a new book (Admin only)")
    public ResponseEntity<ApiResponse<BookResponse>> addBook(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book added successfully", bookService.addBook(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Book", description = "Update book details (Admin only)")
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(
            @PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book updated successfully", bookService.updateBook(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete Book", description = "Delete a book (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted successfully"));
    }
}
