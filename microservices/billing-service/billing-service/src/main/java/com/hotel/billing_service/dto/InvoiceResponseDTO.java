package com.hotel.billing_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponseDTO {
    private Long id;
    private String invoiceNumber;
    private Long bookingId;
    private Long customerId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfNights;
    private BigDecimal roomCharges;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}