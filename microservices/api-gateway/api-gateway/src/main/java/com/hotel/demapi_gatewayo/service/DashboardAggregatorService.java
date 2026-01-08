package com.hotel.demapi_gatewayo.service;

import com.hotel.demapi_gatewayo.dto.DashboardStatsDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardAggregatorService {

    private final WebClient.Builder webClientBuilder;
    
    private static final Duration TIMEOUT = Duration.ofSeconds(5);

    public DashboardStatsDTO aggregateStats() {
        log.info("Aggregating dashboard statistics from all microservices");
        
        // ✅ Correction 1: Utiliser /count/status/PENDING au lieu de /count/pending
        Mono<Long> totalBookingsMono = fetchStat(
            "http://booking-service/api/bookings/count",
            "Total Bookings"
        );

        Mono<Long> pendingBookingsMono = fetchStat(
            "http://booking-service/api/bookings/count/status/PENDING",
            "Pending Bookings"
        );

        // ✅ Correction 2: Nom correct du service (billing-service, pas invoice-service)
        Mono<Long> totalInvoicesMono = fetchStat(
            "http://billing-service/api/billing/count",
            "Total Invoices"
        );

        Mono<Long> availableRoomsMono = fetchStat(
            "http://room-service/api/rooms/count/available",
            "Available Rooms"
        );

        // Combiner tous les résultats en parallèle
        return Mono.zip(totalBookingsMono, pendingBookingsMono, 
                       totalInvoicesMono, availableRoomsMono)
            .map(tuple -> {
                DashboardStatsDTO stats = DashboardStatsDTO.builder()
                    .totalBookings(tuple.getT1())
                    .pendingBookings(tuple.getT2())
                    .totalInvoices(tuple.getT3())
                    .availableRooms(tuple.getT4())
                    .build();
                
                log.info("Dashboard stats aggregated successfully: {}", stats);
                return stats;
            })
            .doOnError(error -> log.error("Error aggregating dashboard stats", error))
            .onErrorReturn(getDefaultStats())
            .block(TIMEOUT);
    }
    
    /**
     * Méthode générique pour récupérer une statistique
     */
    private Mono<Long> fetchStat(String url, String statName) {
        return webClientBuilder.build()
            .get()
            .uri(url)
            .retrieve()
            .bodyToMono(Long.class)
            .timeout(TIMEOUT)
            .doOnSuccess(value -> log.debug("{}: {}", statName, value))
            .doOnError(error -> log.error("Failed to fetch {}: {}", statName, error.getMessage()))
            .onErrorReturn(0L);
    }
    
    /**
     * Retourne des statistiques par défaut en cas d'erreur
     */
    private DashboardStatsDTO getDefaultStats() {
        log.warn("Returning default stats due to errors");
        return DashboardStatsDTO.builder()
            .totalBookings(0L)
            .pendingBookings(0L)
            .totalInvoices(0L)
            .availableRooms(0L)
            .build();
    }
}