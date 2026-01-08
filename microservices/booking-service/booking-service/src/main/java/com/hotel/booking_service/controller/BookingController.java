package com.hotel.booking_service.controller;

import com.hotel.booking_service.dto.BookingRequestDTO;
import com.hotel.booking_service.dto.BookingResponseDTO;
import com.hotel.booking_service.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    // ✅ PUT THESE SPECIFIC ROUTES FIRST - BEFORE /{id}
    @GetMapping("/count")
    public ResponseEntity<Long> countAllBookings() {
        Long count = bookingService.countAll();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countBookingsByStatus(@PathVariable String status) {
        Long count = bookingService.countByStatus(status.toUpperCase());
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByCustomer(@PathVariable Long customerId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByCustomer(customerId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByRoom(@PathVariable Long roomId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByRoom(roomId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    // ✅ PUT GENERIC /{id} ROUTE LAST
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        BookingResponseDTO response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/{id}/confirm")
    public ResponseEntity<BookingResponseDTO> confirmBooking(@PathVariable Long id) {
        BookingResponseDTO response = bookingService.confirmBooking(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(@PathVariable Long id) {
        BookingResponseDTO response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponseDTO> completeBooking(@PathVariable Long id) {
        BookingResponseDTO response = bookingService.completeBooking(id);
        return ResponseEntity.ok(response);
    }
}