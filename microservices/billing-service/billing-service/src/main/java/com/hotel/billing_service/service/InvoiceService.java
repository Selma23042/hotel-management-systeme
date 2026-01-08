package com.hotel.billing_service.service;


import com.hotel.billing_service.dto.BookingEventDTO;
import com.hotel.billing_service.dto.InvoiceRequestDTO;
import com.hotel.billing_service.dto.InvoiceResponseDTO;
import com.hotel.billing_service.dto.PaymentRequestDTO;
import com.hotel.billing_service.exception.InvalidInvoiceException;
import com.hotel.billing_service.exception.InvoiceNotFoundException;
import com.hotel.billing_service.model.Invoice;
import com.hotel.billing_service.model.InvoiceStatus;
import com.hotel.billing_service.model.PaymentMethod;
import com.hotel.billing_service.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;
    private static final BigDecimal TAX_RATE = new BigDecimal("0.10"); // 10% tax
    
    public InvoiceResponseDTO createInvoiceFromBooking(BookingEventDTO event) {
        log.info("Creating invoice for booking: {}", event.getBookingId());
        
        // Vérifier qu'une facture n'existe pas déjà pour cette réservation
        if (invoiceRepository.existsByBookingId(event.getBookingId())) {
            throw new InvalidInvoiceException("Invoice already exists for booking: " + event.getBookingId());
        }
        
        // Calculer le nombre de nuits
        long numberOfNights = ChronoUnit.DAYS.between(event.getCheckInDate(), event.getCheckOutDate());
        
        // Calculer les montants
        BigDecimal roomCharges = event.getTotalPrice();
        BigDecimal taxAmount = roomCharges.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = roomCharges.add(taxAmount).setScale(2, RoundingMode.HALF_UP);
        
        // Créer la facture
        Invoice invoice = new Invoice();
        invoice.setBookingId(event.getBookingId());
        invoice.setCustomerId(event.getCustomerId());
        invoice.setRoomId(event.getRoomId());
        invoice.setCheckInDate(event.getCheckInDate());
        invoice.setCheckOutDate(event.getCheckOutDate());
        invoice.setNumberOfNights((int) numberOfNights);
        invoice.setRoomCharges(roomCharges);
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalAmount(totalAmount);
        invoice.setStatus(InvoiceStatus.PENDING);
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        log.info("Invoice created with number: {}", savedInvoice.getInvoiceNumber());
        
        return convertToDTO(savedInvoice);
    }
    
    public InvoiceResponseDTO createInvoice(InvoiceRequestDTO request) {
        log.info("Creating manual invoice for booking: {}", request.getBookingId());
        
        if (invoiceRepository.existsByBookingId(request.getBookingId())) {
            throw new InvalidInvoiceException("Invoice already exists for booking: " + request.getBookingId());
        }
        
        long numberOfNights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        
        BigDecimal roomCharges = request.getRoomCharges();
        BigDecimal taxAmount = roomCharges.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = roomCharges.add(taxAmount).setScale(2, RoundingMode.HALF_UP);
        
        Invoice invoice = new Invoice();
        invoice.setBookingId(request.getBookingId());
        invoice.setCustomerId(request.getCustomerId());
        invoice.setRoomId(request.getRoomId());
        invoice.setCheckInDate(request.getCheckInDate());
        invoice.setCheckOutDate(request.getCheckOutDate());
        invoice.setNumberOfNights((int) numberOfNights);
        invoice.setRoomCharges(roomCharges);
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalAmount(totalAmount);
        invoice.setStatus(InvoiceStatus.PENDING);
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return convertToDTO(savedInvoice);
    }
    
    public InvoiceResponseDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + id));
        return convertToDTO(invoice);
    }
    
    public InvoiceResponseDTO getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
            .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with number: " + invoiceNumber));
        return convertToDTO(invoice);
    }
    
    public InvoiceResponseDTO getInvoiceByBookingId(Long bookingId) {
        Invoice invoice = invoiceRepository.findByBookingId(bookingId)
            .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found for booking: " + bookingId));
        return convertToDTO(invoice);
    }
    
    public List<InvoiceResponseDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<InvoiceResponseDTO> getInvoicesByCustomer(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<InvoiceResponseDTO> getInvoicesByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatus(status).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public InvoiceResponseDTO processPayment(Long invoiceId, PaymentRequestDTO paymentRequest) {
        log.info("Processing payment for invoice: {}", invoiceId);
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + invoiceId));
        
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new InvalidInvoiceException("Invoice is already paid");
        }
        
        if (invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new InvalidInvoiceException("Cannot pay a cancelled invoice");
        }
        
        // Valider et définir la méthode de paiement
        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(paymentRequest.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInvoiceException("Invalid payment method: " + paymentRequest.getPaymentMethod());
        }
        
        invoice.setPaymentMethod(method);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        
        Invoice paidInvoice = invoiceRepository.save(invoice);
        log.info("Payment processed successfully for invoice: {}", invoiceId);
        
        return convertToDTO(paidInvoice);
    }
    
    public InvoiceResponseDTO cancelInvoice(Long invoiceId) {
        log.info("Cancelling invoice: {}", invoiceId);
        
        Invoice invoice = invoiceRepository.findById(invoiceId)
            .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + invoiceId));
        
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new InvalidInvoiceException("Cannot cancel a paid invoice");
        }
        
        if (invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new InvalidInvoiceException("Invoice is already cancelled");
        }
        
        invoice.setStatus(InvoiceStatus.CANCELLED);
        Invoice cancelledInvoice = invoiceRepository.save(invoice);
        
        return convertToDTO(cancelledInvoice);
    }
    
    private InvoiceResponseDTO convertToDTO(Invoice invoice) {
        return new InvoiceResponseDTO(
            invoice.getId(),
            invoice.getInvoiceNumber(),
            invoice.getBookingId(),
            invoice.getCustomerId(),
            invoice.getRoomId(),
            invoice.getCheckInDate(),
            invoice.getCheckOutDate(),
            invoice.getNumberOfNights(),
            invoice.getRoomCharges(),
            invoice.getTaxAmount(),
            invoice.getTotalAmount(),
            invoice.getStatus().name(),
            invoice.getPaymentMethod() != null ? invoice.getPaymentMethod().name() : null,
            invoice.getPaidAt(),
            invoice.getCreatedAt()
        );
    }
   public Long countAll() {
    return invoiceRepository.count();
}

public Long countByStatus(String statusStr) {
    InvoiceStatus status = InvoiceStatus.valueOf(statusStr);
    return invoiceRepository.countByStatus(status);
}
}
