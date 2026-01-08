package com.hotel.billing_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
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
    
    // Exchange - Le billing-service peut aussi déclarer l'exchange (c'est idempotent)
    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(bookingExchange, true, false);
    }
    
    // Queues - IMPORTANT : Le consumer doit aussi déclarer les queues
    @Bean
    public Queue bookingConfirmedQueue() {
        return QueueBuilder.durable(bookingConfirmedQueue)
            .build();
    }
    
    @Bean
    public Queue bookingCompletedQueue() {
        return QueueBuilder.durable(bookingCompletedQueue)
            .build();
    }
    
    // Bindings
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
    
    // RabbitTemplate (optionnel pour le consumer, mais utile si vous voulez aussi envoyer)
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
    
    // ⚠️ IMPORTANT : Configuration du Listener pour RECEVOIR les messages
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter());
        factory.setPrefetchCount(10); // Nombre de messages à précharger
        factory.setDefaultRequeueRejected(false); // Ne pas remettre en queue si erreur
        factory.setConcurrentConsumers(1); // Nombre de consumers par défaut
        factory.setMaxConcurrentConsumers(5); // Maximum de consumers
        return factory;
    }
}