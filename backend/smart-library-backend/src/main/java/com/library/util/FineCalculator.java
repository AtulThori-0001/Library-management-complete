package com.library.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class FineCalculator {

    @Value("${app.fine.per-day:5.00}")
    private BigDecimal finePerDay;

    @Value("${app.fine.grace-period-days:0}")
    private int gracePeriodDays;

    public BigDecimal calculateFine(LocalDate dueDate, LocalDate returnDate) {
        if (returnDate == null) returnDate = LocalDate.now();
        long daysOverdue = ChronoUnit.DAYS.between(dueDate, returnDate);
        if (daysOverdue <= gracePeriodDays) return BigDecimal.ZERO;
        long billableDays = daysOverdue - gracePeriodDays;
        return finePerDay.multiply(BigDecimal.valueOf(billableDays));
    }

    public long getDaysOverdue(LocalDate dueDate) {
        long days = ChronoUnit.DAYS.between(dueDate, LocalDate.now());
        return Math.max(0, days);
    }

    public boolean isOverdue(LocalDate dueDate) {
        return LocalDate.now().isAfter(dueDate);
    }
}
