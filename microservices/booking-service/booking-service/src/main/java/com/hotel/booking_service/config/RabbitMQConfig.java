package com.hotel.booking_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    @Value("${rabbitmq.exchange.booking}")
    private String bookingExchange;
    
    @Value("${rabbitmq.queue.booking-confirmed}")
    private String bookingConfirmedQueue;
    
    @Value("${rabbitmq.queue.booking-completed}")
    private String bookingCompletedQueue;
    
    @Value("${rabbitmq.routing-key.booking-confirmed}")
    private String bookingConfirmedRoutingKey;
    
    @Value("${rabbitmq.routing-key.booking-completed}")
    private String bookingCompletedRoutingKey;
    
    // Exchange
    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(bookingExchange, true, false);
    }
    
    // Queues
    @Bean
    public Queue bookingConfirmedQueue() {
        return QueueBuilder.durable(bookingConfirmedQueue).build();
    }
    
    @Bean
    public Queue bookingCompletedQueue() {
        return QueueBuilder.durable(bookingCompletedQueue).build();
    }
    
    // Bindings - Associer les queues à l'exchange
    @Bean
    public Binding bookingConfirmedBinding() {
        return BindingBuilder
            .bind(bookingConfirmedQueue())
            .to(bookingExchange())
            .with(bookingConfirmedRoutingKey);
    }
    
    @Bean
    public Binding bookingCompletedBinding() {
        return BindingBuilder
            .bind(bookingCompletedQueue())
            .to(bookingExchange())
            .with(bookingCompletedRoutingKey);
    }
    
    // Message converter pour JSON
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    // RabbitTemplate pour ENVOYER des messages
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}