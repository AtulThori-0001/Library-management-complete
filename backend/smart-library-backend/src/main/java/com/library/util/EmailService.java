package com.library.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:library@example.com}")
    private String fromEmail;

    @Async("taskExecutor")
    public void sendBookIssuedEmail(String toEmail, String studentName, String bookTitle, String dueDate) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Book Issued - Smart Library");
            message.setText(String.format(
                "Dear %s,\n\nThe book \'%s\' has been issued to you.\nPlease return it by: %s\n\n" +
                "A fine of ₹5 per day will be charged for late returns.\n\nThank you,\nSmart Library",
                studentName, bookTitle, dueDate));
            mailSender.send(message);
            log.info("Book issued email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async("taskExecutor")
    public void sendOverdueReminderEmail(String toEmail, String studentName, String bookTitle, long daysOverdue) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Overdue Book Reminder - Smart Library");
            message.setText(String.format(
                "Dear %s,\n\nThis is a reminder that the book \'%s\' is overdue by %d days.\n" +
                "Current fine: ₹%.2f\n\nPlease return the book at the earliest.\n\nThank you,\nSmart Library",
                studentName, bookTitle, daysOverdue, daysOverdue * 5.0));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send overdue reminder to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async("taskExecutor")
    public void sendReturnConfirmationEmail(String toEmail, String studentName, String bookTitle, double fine) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Book Returned - Smart Library");
            message.setText(String.format(
                "Dear %s,\n\nThank you for returning \'%s\'.\n" +
                (fine > 0 ? "Fine collected: ₹" + fine + "\n" : "") +
                "\nHappy reading!\n\nSmart Library",
                studentName, bookTitle));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send return confirmation to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async("taskExecutor")
    public void sendReservationEmail(String toEmail, String studentName, String bookTitle) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Book Reservation Confirmed - Smart Library");
            message.setText(String.format(
                "Dear %s,\n\nYour reservation for \'%s\' has been confirmed.\n" +
                "You will be notified when the book becomes available.\n\nSmart Library",
                studentName, bookTitle));
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send reservation email to {}: {}", toEmail, e.getMessage());
        }
    }
}
