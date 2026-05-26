package com.library.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.library.dto.response.TransactionResponse;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfReportGenerator {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
    private static final Font CELL_FONT = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.BLACK);
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 11, Font.ITALIC, BaseColor.GRAY);

    public byte[] generateTransactionReport(List<TransactionResponse> transactions, String reportTitle) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        Paragraph title = new Paragraph("Smart Library Management System", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph subtitle = new Paragraph(reportTitle + " — Generated: " +
                LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), SUBTITLE_FONT);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(20);
        document.add(subtitle);

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1f, 3f, 3f, 2f, 2f, 2f, 2f});

        addHeaderCell(table, "#");
        addHeaderCell(table, "Student");
        addHeaderCell(table, "Book Title");
        addHeaderCell(table, "Issue Date");
        addHeaderCell(table, "Due Date");
        addHeaderCell(table, "Return Date");
        addHeaderCell(table, "Fine (₹)");

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        int i = 1;
        for (TransactionResponse t : transactions) {
            boolean alt = (i % 2 == 0);
            BaseColor bg = alt ? new BaseColor(240, 240, 240) : BaseColor.WHITE;
            addCell(table, String.valueOf(i++), bg);
            addCell(table, t.getUserName(), bg);
            addCell(table, t.getBookTitle(), bg);
            addCell(table, t.getIssueDate() != null ? t.getIssueDate().format(fmt) : "-", bg);
            addCell(table, t.getDueDate() != null ? t.getDueDate().format(fmt) : "-", bg);
            addCell(table, t.getReturnDate() != null ? t.getReturnDate().format(fmt) : "Not Returned", bg);
            addCell(table, t.getFineAmount() != null ? "₹" + t.getFineAmount() : "₹0", bg);
        }
        document.add(table);

        Paragraph footer = new Paragraph("Total Records: " + transactions.size(), CELL_FONT);
        footer.setSpacingBefore(10);
        document.add(footer);

        document.close();
        return baos.toByteArray();
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, HEADER_FONT));
        cell.setBackgroundColor(new BaseColor(33, 97, 140));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text, BaseColor bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, CELL_FONT));
        cell.setBackgroundColor(bg);
        cell.setPadding(5);
        table.addCell(cell);
    }
}
