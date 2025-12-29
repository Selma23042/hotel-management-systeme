# Architecture du Système

## Vue d'ensemble
- **Eureka Server** : Port 8761
- **API Gateway** : Port 8080
- **Room Service** : Port 8081
- **Booking Service** : Port 8082
- **Customer Service** : Port 8083
- **Billing Service** : Port 8084

## Bases de données
- Room DB : localhost:5432
- Booking DB : localhost:5433
- Customer DB : localhost:5434
- Billing DB : localhost:5435

## Message Broker
- RabbitMQ : localhost:5672 (AMQP)
- RabbitMQ Management : localhost:15672 (Web UI)

## Flux de communication
1. Toutes les requêtes passent par l'API Gateway (8080)
2. L'API Gateway route vers le bon microservice
3. Les microservices communiquent entre eux via REST ou RabbitMQ
4. Tous les services s'enregistrent auprès d'Eureka

## Sécurité
- JWT géré par Customer Service
- Validation des tokens par API Gateway