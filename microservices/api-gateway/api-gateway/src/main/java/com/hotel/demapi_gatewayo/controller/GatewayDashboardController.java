package com.hotel.demapi_gatewayo.controller;

import com.hotel.demapi_gatewayo.dto.DashboardStatsDTO;
import com.hotel.demapi_gatewayo.service.DashboardAggregatorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Slf4j
public class GatewayDashboardController {

    private final DashboardAggregatorService dashboardService;

    /**
     * Récupère les statistiques agrégées du dashboard
     * GET /api/dashboard/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        try {
            log.info("Fetching dashboard statistics");
            DashboardStatsDTO stats = dashboardService.aggregateStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats: {}", e.getMessage(), e);
            
            // Retourner des statistiques par défaut avec un statut 200
            // (L'utilisateur voit au moins quelque chose)
            DashboardStatsDTO defaultStats = DashboardStatsDTO.builder()
                .totalBookings(0L)
                .pendingBookings(0L)
                .totalInvoices(0L)
                .availableRooms(0L)
                .build();
            
            return ResponseEntity.ok(defaultStats);
        }
    }

    /**
     * Endpoint de test pour vérifier que le controller fonctionne
     * GET /api/dashboard/test
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        log.info("Dashboard test endpoint called");
        return ResponseEntity.ok("Dashboard controller fonctionne correctement !");
    }
    
    /**
     * Health check pour le dashboard
     * GET /api/dashboard/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Dashboard service is UP");
    }
}