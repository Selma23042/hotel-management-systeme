package com.hotel.booking_service.repository;

import com.hotel.booking_service.model.Booking;
import com.hotel.booking_service.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByCustomerId(Long customerId);
    
    List<Booking> findByRoomId(Long roomId);
    
    List<Booking> findByStatus(BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.roomId = :roomId " +
           "AND b.status IN ('PENDING', 'CONFIRMED') " +
           "AND ((b.checkInDate <= :checkOut AND b.checkOutDate >= :checkIn))")
    List<Booking> findConflictingBookings(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
    
    @Query("SELECT b FROM Booking b WHERE b.checkInDate = :date AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsCheckingInToday(@Param("date") LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.checkOutDate = :date AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsCheckingOutToday(@Param("date") LocalDate date);

    long countByStatus(BookingStatus status);
}