package com.library.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title too long")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    @NotBlank(message = "ISBN is required")
    // @Pattern(regexp = "^[0-9\-X]{10,20}$", message = "Invalid ISBN format")
    @Pattern(regexp = "^(?:[0-9]{9}X|[0-9]{10}|[0-9]{13}|[0-9-]{10,20})$", message = "Invalid ISBN format")
    private String isbn;

    private String publisher;
    private Integer publishYear;
    private String category;
    private String description;

    @Min(value = 1, message = "Total copies must be at least 1")
    private Integer totalCopies = 1;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price = BigDecimal.ZERO;

    private String location;
    private String coverImage;
    private String edition;
    private String language;
    private Integer pages;
}
