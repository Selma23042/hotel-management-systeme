package com.hotel.booking_service.service;

import com.hotel.booking_service.client.CustomerServiceClient;
import com.hotel.booking_service.client.RoomServiceClient;
import com.hotel.booking_service.dto.BookingRequestDTO;
import com.hotel.booking_service.dto.BookingResponseDTO;
import com.hotel.booking_service.dto.BookingEventDTO;
import com.hotel.booking_service.dto.CustomerDTO;
import com.hotel.booking_service.dto.RoomDTO;
import com.hotel.booking_service.exception.BookingNotFoundException;
import com.hotel.booking_service.exception.InvalidBookingException;
import com.hotel.booking_service.exception.RoomNotAvailableException;
import com.hotel.booking_service.messaging.BookingEventPublisher;
import com.hotel.booking_service.model.Booking;
import com.hotel.booking_service.model.BookingStatus;
import com.hotel.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomServiceClient roomServiceClient;
    private final CustomerServiceClient customerServiceClient;
    private final BookingEventPublisher eventPublisher;
    
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        log.info("Creating booking for customer: {} and room: {}", 
                 request.getCustomerId(), request.getRoomId());
        
        // Validation des dates
        validateBookingDates(request.getCheckInDate(), request.getCheckOutDate());
        
        // Vérifier que le client existe
        CustomerDTO customer;
        try {
            customer = customerServiceClient.getCustomerById(request.getCustomerId());
        } catch (Exception e) {
            throw new InvalidBookingException("Customer not found with id: " + request.getCustomerId());
        }
        
        // Vérifier que la chambre existe et est disponible
        RoomDTO room;
        try {
            room = roomServiceClient.getRoomById(request.getRoomId());
        } catch (Exception e) {
            throw new InvalidBookingException("Room not found with id: " + request.getRoomId());
        }
        
        if (!"AVAILABLE".equals(room.getStatus())) {
            throw new RoomNotAvailableException("Room is not available");
        }
        
        // Vérifier la capacité de la chambre
        if (request.getNumberOfGuests() > room.getCapacity()) {
            throw new InvalidBookingException(
                "Number of guests exceeds room capacity. Room capacity: " + room.getCapacity()
            );
        }
        
        // Vérifier les conflits de réservation
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            request.getRoomId(),
            request.getCheckInDate(),
            request.getCheckOutDate()
        );
        
        if (!conflicts.isEmpty()) {
            throw new RoomNotAvailableException(
                "Room is already booked for the selected dates"
            );
        }
        
        // Calculer le prix total
        long numberOfNights = ChronoUnit.DAYS.between(
            request.getCheckInDate(),
            request.getCheckOutDate()
        );
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(numberOfNights));
        
        // Créer la réservation
        Booking booking = new Booking();
        booking.setCustomerId(request.getCustomerId());
        booking.setRoomId(request.getRoomId());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);
        booking.setSpecialRequests(request.getSpecialRequests());
        
        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created with id: {}", savedBooking.getId());
        
        return convertToDTO(savedBooking, customer, room);
    }
    
    public BookingResponseDTO confirmBooking(Long bookingId) {
        log.info("Confirming booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingException("Only pending bookings can be confirmed");
        }
        
        // Mettre à jour le statut de la chambre
        try {
            roomServiceClient.updateRoomStatus(booking.getRoomId(), "RESERVED");
        } catch (Exception e) {
            log.error("Failed to update room status", e);
            throw new InvalidBookingException("Failed to reserve room");
        }
        
        // Confirmer la réservation
        booking.setStatus(BookingStatus.CONFIRMED);
        Booking confirmedBooking = bookingRepository.save(booking);
        
        // Publier l'événement pour le Billing Service
        BookingEventDTO event = new BookingEventDTO(
            confirmedBooking.getId(),
            confirmedBooking.getCustomerId(),
            confirmedBooking.getRoomId(),
            confirmedBooking.getCheckInDate(),
            confirmedBooking.getCheckOutDate(),
            confirmedBooking.getTotalPrice(),
            confirmedBooking.getStatus().name(),
            LocalDateTime.now()
        );
        eventPublisher.publishBookingConfirmed(event);
        
        log.info("Booking confirmed: {}", bookingId);
        
        CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
        RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
        
        return convertToDTO(confirmedBooking, customer, room);
    }
    
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
        
        CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
        RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
        
        return convertToDTO(booking, customer, room);
    }
    
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
            .map(booking -> {
                CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
                RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
                return convertToDTO(booking, customer, room);
            })
            .collect(Collectors.toList());
    }
    
    public List<BookingResponseDTO> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
            .map(booking -> {
                CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
                RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
                return convertToDTO(booking, customer, room);
            })
            .collect(Collectors.toList());
    }
    
    public List<BookingResponseDTO> getBookingsByRoom(Long roomId) {
        return bookingRepository.findByRoomId(roomId).stream()
            .map(booking -> {
                CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
                RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
                return convertToDTO(booking, customer, room);
            })
            .collect(Collectors.toList());
    }
    
    public BookingResponseDTO cancelBooking(Long bookingId) {
        log.info("Cancelling booking: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() == BookingStatus.COMPLETED || 
            booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingException("Cannot cancel a " + booking.getStatus() + " booking");
        }
        
        // Libérer la chambre
        try {
            roomServiceClient.updateRoomStatus(booking.getRoomId(), "AVAILABLE");
        } catch (Exception e) {
            log.error("Failed to update room status", e);
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);
        
        CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
        RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
        
        return convertToDTO(cancelledBooking, customer, room);
    }
    
   public BookingResponseDTO completeBooking(Long bookingId) {
    log.info("Completing booking: {}", bookingId);
    
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));
    
    if (booking.getStatus() != BookingStatus.CONFIRMED) {
        throw new InvalidBookingException("Only confirmed bookings can be completed");
    }
    
    // Libérer la chambre
    try {
        roomServiceClient.updateRoomStatus(booking.getRoomId(), "AVAILABLE");
    } catch (Exception e) {
        log.error("Failed to update room status", e);
    }
    
    booking.setStatus(BookingStatus.COMPLETED);
    Booking completedBooking = bookingRepository.save(booking);
    
    // 🔥 AJOUTER CETTE PARTIE - Publier l'événement pour créer la facture
    BookingEventDTO event = new BookingEventDTO(
        completedBooking.getId(),
        completedBooking.getCustomerId(),
        completedBooking.getRoomId(),
        completedBooking.getCheckInDate(),
        completedBooking.getCheckOutDate(),
        completedBooking.getTotalPrice(),
        completedBooking.getStatus().name(),
        LocalDateTime.now()
    );
    eventPublisher.publishBookingCompleted(event); // ou publishBookingConfirmed(event)
    
    log.info("Booking completed and invoice event published: {}", bookingId);
    // 🔥 FIN DE L'AJOUT
    
    CustomerDTO customer = customerServiceClient.getCustomerById(booking.getCustomerId());
    RoomDTO room = roomServiceClient.getRoomById(booking.getRoomId());
    
    return convertToDTO(completedBooking, customer, room);
}
    
    private void validateBookingDates(LocalDate checkIn, LocalDate checkOut) {
        LocalDate today = LocalDate.now();
        
        if (checkIn.isBefore(today)) {
            throw new InvalidBookingException("Check-in date cannot be in the past");
        }
        
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new InvalidBookingException("Check-out date must be after check-in date");
        }
    }
    
    private BookingResponseDTO convertToDTO(Booking booking, CustomerDTO customer, RoomDTO room) {
        return new BookingResponseDTO(
            booking.getId(),
            booking.getCustomerId(),
            customer.getFirstName() + " " + customer.getLastName(),
            booking.getRoomId(),
            room.getRoomNumber(),
            booking.getCheckInDate(),
            booking.getCheckOutDate(),
            booking.getNumberOfGuests(),
            booking.getTotalPrice(),
            booking.getStatus().name(),
            booking.getSpecialRequests(),
            booking.getCreatedAt()
        );
    }
public Long countAll() {
    return bookingRepository.count();
}

public Long countByStatus(String statusStr) {
    BookingStatus status = BookingStatus.valueOf(statusStr);
    return bookingRepository.countByStatus(status);
}}