package com.library.librarymanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.entity.Book;
import com.library.librarymanagement.repository.BookRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Add Book
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Get All Books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Delete Book
    public String deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            return "Book not found";
        }
        bookRepository.deleteById(id);
        return "Book Deleted Successfully";
    }

    // Update Book
    public Book updateBook(Long id, Book updatedBook) {
        Book existingBook = bookRepository.findById(id).orElse(null);

        if (existingBook != null) {
            existingBook.setTitle(updatedBook.getTitle());
            existingBook.setAuthor(updatedBook.getAuthor());
            existingBook.setPrice(updatedBook.getPrice());
            return bookRepository.save(existingBook);
        }

        return null;
    }
}
