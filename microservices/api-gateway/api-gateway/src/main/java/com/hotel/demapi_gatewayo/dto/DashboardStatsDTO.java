package com.hotel.demapi_gatewayo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalBookings;
    private Long pendingBookings;
    private Long totalInvoices;
    private Long availableRooms;
}