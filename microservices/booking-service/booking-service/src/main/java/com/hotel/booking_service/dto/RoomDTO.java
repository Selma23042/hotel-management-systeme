package com.hotel.booking_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private String roomType;
    private BigDecimal pricePerNight;
    private String status;
    private Integer capacity;
}