package com.hotel.billing_service.controller;


import com.hotel.billing_service.dto.InvoiceRequestDTO;
import com.hotel.billing_service.dto.InvoiceResponseDTO;
import com.hotel.billing_service.dto.PaymentRequestDTO;
import com.hotel.billing_service.model.InvoiceStatus;
import com.hotel.billing_service.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    
    @PostMapping("/invoices")
    public ResponseEntity<InvoiceResponseDTO> createInvoice(@Valid @RequestBody InvoiceRequestDTO request) {
        InvoiceResponseDTO response = invoiceService.createInvoice(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceResponseDTO>> getAllInvoices() {
        List<InvoiceResponseDTO> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/invoices/{id}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(@PathVariable Long id) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/invoices/number/{invoiceNumber}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/invoices/booking/{bookingId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceByBookingId(@PathVariable Long bookingId) {
        InvoiceResponseDTO invoice = invoiceService.getInvoiceByBookingId(bookingId);
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/invoices/customer/{customerId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByCustomer(@PathVariable Long customerId) {
        List<InvoiceResponseDTO> invoices = invoiceService.getInvoicesByCustomer(customerId);
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/invoices/status/{status}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByStatus(@PathVariable String status) {
        InvoiceStatus invoiceStatus = InvoiceStatus.valueOf(status.toUpperCase());
        List<InvoiceResponseDTO> invoices = invoiceService.getInvoicesByStatus(invoiceStatus);
        return ResponseEntity.ok(invoices);
    }
    
    @PostMapping("/invoices/{id}/pay")
    public ResponseEntity<InvoiceResponseDTO> processPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequestDTO paymentRequest) {
        InvoiceResponseDTO response = invoiceService.processPayment(id, paymentRequest);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/invoices/{id}/cancel")
    public ResponseEntity<InvoiceResponseDTO> cancelInvoice(@PathVariable Long id) {
        InvoiceResponseDTO response = invoiceService.cancelInvoice(id);
        return ResponseEntity.ok(response);
    }
}