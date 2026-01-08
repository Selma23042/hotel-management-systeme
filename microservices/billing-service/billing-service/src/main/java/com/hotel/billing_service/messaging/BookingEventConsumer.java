package com.hotel.billing_service.messaging;

import com.hotel.billing_service.dto.BookingEventDTO;
import com.hotel.billing_service.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventConsumer {
    
    private final InvoiceService invoiceService;
    
    /**
     * Écouter les événements de CONFIRMATION de réservation (optionnel)
     * Vous pouvez créer une facture en brouillon si nécessaire
     */
    @RabbitListener(queues = "${rabbitmq.queue.booking-confirmed}")
    public void handleBookingConfirmed(BookingEventDTO event) {
        try {
            log.info("📩 Received booking CONFIRMED event for booking: {}", event.getBookingId());
            // Option 1 : Ne rien faire (attendre la complétion)
            // Option 2 : Créer une facture en DRAFT
            log.info("✅ Booking confirmed event processed (no action taken)");
        } catch (Exception e) {
            log.error("❌ Failed to process booking confirmed event", e);
        }
    }
    
    /**
     * Écouter les événements de COMPLÉTION de réservation
     * ⚠️ C'EST ICI QUE LA FACTURE EST CRÉÉE
     */
    @RabbitListener(queues = "${rabbitmq.queue.booking-completed}")
    public void handleBookingCompleted(BookingEventDTO event) {
        try {
            log.info("📩 Received booking COMPLETED event for booking: {}", event.getBookingId());
            
            // Créer la facture
            invoiceService.createInvoiceFromBooking(event);
            
            log.info("✅ Invoice created successfully for booking: {}", event.getBookingId());
        } catch (Exception e) {
            log.error("❌ Failed to create invoice for booking: {}", event.getBookingId(), e);
            // TODO: Implémenter une Dead Letter Queue pour retry
            throw e; // Relancer l'exception pour potentiel retry
        }
    }
}