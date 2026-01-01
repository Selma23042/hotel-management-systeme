package com.hotel.billing_service.messaging;


import com.hotel.billing_service.dto.BookingEventDTO;
import com.hotel.billing_service.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEventConsumer {
    
    private final InvoiceService invoiceService;
    
    @RabbitListener(queues = "${rabbitmq.queue.billing}")
    public void handleBookingEvent(BookingEventDTO event) {
        log.info("Received booking event: {}", event);
        
        try {
            if ("CONFIRMED".equals(event.getStatus())) {
                invoiceService.createInvoiceFromBooking(event);
                log.info("Invoice created successfully for booking: {}", event.getBookingId());
            }
        } catch (Exception e) {
            log.error("Error processing booking event: {}", e.getMessage(), e);
            // Dans un système réel, vous pourriez renvoyer le message dans une dead letter queue
        }
    }
}