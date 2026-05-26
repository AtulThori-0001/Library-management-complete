package com.library.dto.response;

import com.library.entity.BookStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private String category;
    private String description;
    private Integer totalCopies;
    private Integer availableCopies;
    private BigDecimal price;
    private String location;
    private String coverImage;
    private String edition;
    private String language;
    private Integer pages;
    private BookStatus status;
    private LocalDateTime createdAt;
}
