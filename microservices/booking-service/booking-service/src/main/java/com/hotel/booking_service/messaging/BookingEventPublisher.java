package com.hotel.booking_service.messaging;

import com.hotel.booking_service.dto.BookingEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEventPublisher {
    
    private final RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange.booking}")
    private String exchange;
    
    @Value("${rabbitmq.routing-key.billing}")
    private String billingRoutingKey;
    
    public void publishBookingConfirmed(BookingEventDTO event) {
        log.info("Publishing booking confirmed event: {}", event);
        rabbitTemplate.convertAndSend(exchange, billingRoutingKey, event);
        log.info("Booking event published successfully");
    }
}