package com.hotel.billing_service.repository;


import com.hotel.billing_service.model.Invoice;
import com.hotel.billing_service.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    Optional<Invoice> findByBookingId(Long bookingId);
    
    List<Invoice> findByCustomerId(Long customerId);
    
    List<Invoice> findByStatus(InvoiceStatus status);
    
    List<Invoice> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    boolean existsByBookingId(Long bookingId);
    long countByStatus(InvoiceStatus status);
}