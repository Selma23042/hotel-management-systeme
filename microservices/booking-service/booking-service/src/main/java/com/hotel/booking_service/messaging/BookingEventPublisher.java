package com.hotel.booking_service.messaging;

import com.hotel.booking_service.dto.BookingEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventPublisher {
    
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.booking}")
    private String bookingExchange;
    
    @Value("${rabbitmq.routing-key.booking-confirmed}")
    private String bookingConfirmedRoutingKey;
    
    @Value("${rabbitmq.routing-key.booking-completed}")
    private String bookingCompletedRoutingKey;
    
    /**
     * Publier l'événement de confirmation de réservation
     */
    public void publishBookingConfirmed(BookingEventDTO event) {
        try {
            log.info("Publishing booking confirmed event for booking: {}", event.getBookingId());
            rabbitTemplate.convertAndSend(
                bookingExchange,
                bookingConfirmedRoutingKey,
                event
            );
            log.info("Booking confirmed event published successfully");
        } catch (Exception e) {
            log.error("Failed to publish booking confirmed event", e);
            throw new RuntimeException("Failed to publish booking event", e);
        }
    }
    
    /**
     * Publier l'événement de complétion de réservation
     * ⚠️ CETTE MÉTHODE DOIT EXISTER
     */
    public void publishBookingCompleted(BookingEventDTO event) {
        try {
            log.info("Publishing booking completed event for booking: {}", event.getBookingId());
            rabbitTemplate.convertAndSend(
                bookingExchange,
                bookingCompletedRoutingKey,
                event
            );
            log.info("Booking completed event published successfully");
        } catch (Exception e) {
            log.error("Failed to publish booking completed event", e);
            throw new RuntimeException("Failed to publish booking event", e);
        }
    }
}