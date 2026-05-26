package com.library.service.impl;

import com.library.dto.request.BookRequest;
import com.library.dto.response.BookResponse;
import com.library.dto.response.PageResponse;
import com.library.entity.Book;
import com.library.entity.BookStatus;
import com.library.exception.BadRequestException;
import com.library.exception.DuplicateResourceException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    @Transactional
    public BookResponse addBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn()))
            throw new DuplicateResourceException("A book with ISBN '" + request.getIsbn() + "' already exists");
        Book book = Book.builder()
                .title(request.getTitle()).author(request.getAuthor()).isbn(request.getIsbn())
                .publisher(request.getPublisher()).publishYear(request.getPublishYear())
                .category(request.getCategory()).description(request.getDescription())
                .totalCopies(request.getTotalCopies()).availableCopies(request.getTotalCopies())
                .price(request.getPrice()).location(request.getLocation())
                .coverImage(request.getCoverImage()).edition(request.getEdition())
                .language(request.getLanguage()).pages(request.getPages())
                .status(BookStatus.AVAILABLE).build();
        return mapToResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = getBookEntity(id);
        if (!book.getIsbn().equals(request.getIsbn()) && bookRepository.existsByIsbn(request.getIsbn()))
            throw new DuplicateResourceException("ISBN '" + request.getIsbn() + "' is already in use");
        int diff = request.getTotalCopies() - book.getTotalCopies();
        book.setTitle(request.getTitle()); book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn()); book.setPublisher(request.getPublisher());
        book.setPublishYear(request.getPublishYear()); book.setCategory(request.getCategory());
        book.setDescription(request.getDescription()); book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(Math.max(0, book.getAvailableCopies() + diff));
        book.setPrice(request.getPrice()); book.setLocation(request.getLocation());
        book.setCoverImage(request.getCoverImage()); book.setEdition(request.getEdition());
        book.setLanguage(request.getLanguage()); book.setPages(request.getPages());
        if (book.getAvailableCopies() > 0) book.setStatus(BookStatus.AVAILABLE);
        return mapToResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = getBookEntity(id);
        if (book.getAvailableCopies() < book.getTotalCopies())
            throw new BadRequestException("Cannot delete book: some copies are currently issued");
        bookRepository.delete(book);
    }

    @Override
    public BookResponse getBookById(Long id) {
        return mapToResponse(getBookEntity(id));
    }

    @Override
    public BookResponse getBookByIsbn(String isbn) {
        return mapToResponse(bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "isbn", isbn)));
    }

    @Override
    public PageResponse<BookResponse> getAllBooks(Pageable pageable) {
        return toPageResponse(bookRepository.findAll(pageable));
    }

    @Override
    public PageResponse<BookResponse> searchBooks(String keyword, Pageable pageable) {
        return toPageResponse(bookRepository.searchBooks(keyword, pageable));
    }

    @Override
    public PageResponse<BookResponse> getBooksByCategory(String category, Pageable pageable) {
        return toPageResponse(bookRepository.findByCategory(category, pageable));
    }

    @Override
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }

    @Override
    public List<BookResponse> getRecentBooks(int limit) {
        return bookRepository.findRecentBooks(PageRequest.of(0, limit))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private Book getBookEntity(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
    }

    private PageResponse<BookResponse> toPageResponse(Page<Book> page) {
        return PageResponse.<BookResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber()).size(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).first(page.isFirst()).build();
    }

    public BookResponse mapToResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId()).title(book.getTitle()).author(book.getAuthor())
                .isbn(book.getIsbn()).publisher(book.getPublisher()).publishYear(book.getPublishYear())
                .category(book.getCategory()).description(book.getDescription())
                .totalCopies(book.getTotalCopies()).availableCopies(book.getAvailableCopies())
                .price(book.getPrice()).location(book.getLocation()).coverImage(book.getCoverImage())
                .edition(book.getEdition()).language(book.getLanguage()).pages(book.getPages())
                .status(book.getStatus()).createdAt(book.getCreatedAt()).build();
    }
}
