package com.library.librarymanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.library.librarymanagement.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
}
