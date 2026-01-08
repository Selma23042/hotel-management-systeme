package com.hotel.room_service.controller;

import com.hotel.room_service.dto.RoomRequestDTO;
import com.hotel.room_service.dto.RoomResponseDTO;
import com.hotel.room_service.model.RoomStatus;
import com.hotel.room_service.model.RoomType;
import com.hotel.room_service.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    
    private final RoomService roomService;
    
    // ✅ 1. METTRE TOUS LES ENDPOINTS SPÉCIFIQUES EN PREMIER
    
    @GetMapping("/count")
    public ResponseEntity<Long> countAllRooms() {
        return ResponseEntity.ok(roomService.countAll());
    }
    
    @GetMapping("/count/available")
    public ResponseEntity<Long> countAvailableRooms() {
        return ResponseEntity.ok(roomService.countAvailable());
    }
    
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countRoomsByStatus(@PathVariable String status) {
        Long count = roomService.countByStatus(status.toUpperCase());
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<RoomResponseDTO> getRoomByNumber(@PathVariable String roomNumber) {
        RoomResponseDTO room = roomService.getRoomByNumber(roomNumber);
        return ResponseEntity.ok(room);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByStatus(@PathVariable RoomStatus status) {
        List<RoomResponseDTO> rooms = roomService.getRoomsByStatus(status);
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByType(@PathVariable RoomType type) {
        List<RoomResponseDTO> rooms = roomService.getRoomsByType(type);
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/available/{type}")
    public ResponseEntity<List<RoomResponseDTO>> getAvailableRoomsByType(@PathVariable RoomType type) {
        List<RoomResponseDTO> rooms = roomService.getAvailableRoomsByType(type);
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<RoomResponseDTO> rooms = roomService.getRoomsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms() {
        List<RoomResponseDTO> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }
    
    // ✅ 2. METTRE L'ENDPOINT GÉNÉRIQUE /{id} À LA FIN
    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable Long id) {
        RoomResponseDTO room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }
    
    // ✅ 3. LES AUTRES MÉTHODES (POST, PUT, DELETE) APRÈS
    @PostMapping
    public ResponseEntity<RoomResponseDTO> createRoom(@Valid @RequestBody RoomRequestDTO request) {
        RoomResponseDTO response = roomService.createRoom(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequestDTO request) {
        RoomResponseDTO response = roomService.updateRoom(id, request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<RoomResponseDTO> updateRoomStatus(
            @PathVariable Long id,
            @RequestParam RoomStatus status) {
        RoomResponseDTO response = roomService.updateRoomStatus(id, status);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}