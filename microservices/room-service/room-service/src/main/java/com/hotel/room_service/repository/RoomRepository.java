package com.hotel.room_service.repository;

import com.hotel.room_service.model.Room;
import com.hotel.room_service.model.RoomStatus;
import com.hotel.room_service.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Optional<Room> findByRoomNumber(String roomNumber);
    
    List<Room> findByStatus(RoomStatus status);
    
    List<Room> findByRoomType(RoomType roomType);
    
    List<Room> findByRoomTypeAndStatus(RoomType roomType, RoomStatus status);
    
    List<Room> findByPricePerNightBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Room> findByFloor(Integer floor);
    
    boolean existsByRoomNumber(String roomNumber);
}