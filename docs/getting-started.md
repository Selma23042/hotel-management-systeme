# Guide de Démarrage

## Prérequis installés
- Java 17
- Maven
- Docker
- Node.js

## Démarrage de l'infrastructure

### 1. Démarrer les bases de données et RabbitMQ
```bash
cd docker
docker-compose -f docker-compose-databases.yml up -d
```

### 2. Démarrer Eureka Server
```bash
cd microservices/eureka-server
mvn spring-boot:run
```

### 3. Démarrer API Gateway
```bash
cd microservices/api-gateway
mvn spring-boot:run
```

### 4. Vérifications
- Eureka : http://localhost:8761
- RabbitMQ : http://localhost:15672 (admin/admin)
- API Gateway : http://localhost:8080/actuator/health

## Arrêt
- Ctrl+C dans chaque terminal pour arrêter les services Spring Boot
- `docker-compose -f docker-compose-databases.yml down` pour arrêter Docker