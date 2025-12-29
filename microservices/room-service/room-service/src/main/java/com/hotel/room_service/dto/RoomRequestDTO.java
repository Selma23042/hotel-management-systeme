package com.hotel.room_service.dto;

import com.hotel.room_service.model.RoomStatus;
import com.hotel.room_service.model.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDTO {
    
    @NotBlank(message = "Room number is required")
    private String roomNumber;
    
    @NotNull(message = "Room type is required")
    private RoomType roomType;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal pricePerNight;
    
    @NotNull(message = "Status is required")
    private RoomStatus status;
    
    private Integer floor;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    private String description;
    
    private String imageUrl;
}