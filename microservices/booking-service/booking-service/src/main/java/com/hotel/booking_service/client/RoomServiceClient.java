package com.hotel.booking_service.client;

import com.hotel.booking_service.dto.RoomDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "room-service")
public interface RoomServiceClient {
    
    @GetMapping("/api/rooms/{id}")
    RoomDTO getRoomById(@PathVariable("id") Long id);
    
    @GetMapping("/api/rooms/available/{type}")
    List<RoomDTO> getAvailableRoomsByType(@PathVariable("type") String type);
    
       @PutMapping("/api/rooms/{id}/status")  // ✅ Changé de @PatchMapping à @PutMapping
    RoomDTO updateRoomStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
