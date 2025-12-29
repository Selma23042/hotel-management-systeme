package com.hotel.room_service.service;

import com.hotel.room_service.dto.RoomRequestDTO;
import com.hotel.room_service.dto.RoomResponseDTO;
import com.hotel.room_service.exception.RoomAlreadyExistsException;
import com.hotel.room_service.exception.RoomNotFoundException;
import com.hotel.room_service.model.Room;
import com.hotel.room_service.model.RoomStatus;
import com.hotel.room_service.model.RoomType;
import com.hotel.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {
    
    private final RoomRepository roomRepository;
    
    public RoomResponseDTO createRoom(RoomRequestDTO request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new RoomAlreadyExistsException("Room with number " + request.getRoomNumber() + " already exists");
        }
        
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setStatus(request.getStatus());
        room.setFloor(request.getFloor());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());
        room.setImageUrl(request.getImageUrl());
        
        Room savedRoom = roomRepository.save(room);
        return convertToDTO(savedRoom);
    }
    
    public RoomResponseDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + id));
        return convertToDTO(room);
    }
    
    public RoomResponseDTO getRoomByNumber(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
            .orElseThrow(() -> new RoomNotFoundException("Room not found with number: " + roomNumber));
        return convertToDTO(room);
    }
    
    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<RoomResponseDTO> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<RoomResponseDTO> getRoomsByType(RoomType type) {
        return roomRepository.findByRoomType(type).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<RoomResponseDTO> getAvailableRoomsByType(RoomType type) {
        return roomRepository.findByRoomTypeAndStatus(type, RoomStatus.AVAILABLE).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<RoomResponseDTO> getRoomsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return roomRepository.findByPricePerNightBetween(minPrice, maxPrice).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public RoomResponseDTO updateRoom(Long id, RoomRequestDTO request) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + id));
        
        if (!room.getRoomNumber().equals(request.getRoomNumber()) 
            && roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new RoomAlreadyExistsException("Room with number " + request.getRoomNumber() + " already exists");
        }
        
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setStatus(request.getStatus());
        room.setFloor(request.getFloor());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());
        room.setImageUrl(request.getImageUrl());
        
        Room updatedRoom = roomRepository.save(room);
        return convertToDTO(updatedRoom);
    }
    
    public RoomResponseDTO updateRoomStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + id));
        room.setStatus(status);
        Room updatedRoom = roomRepository.save(room);
        return convertToDTO(updatedRoom);
    }
    
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RoomNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }
    
    private RoomResponseDTO convertToDTO(Room room) {
        return new RoomResponseDTO(
            room.getId(),
            room.getRoomNumber(),
            room.getRoomType(),
            room.getPricePerNight(),
            room.getStatus(),
            room.getFloor(),
            room.getCapacity(),
            room.getDescription(),
            room.getImageUrl(),
            room.getCreatedAt(),
            room.getUpdatedAt()
        );
    }
}