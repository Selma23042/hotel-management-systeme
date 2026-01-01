# Stage 1: Build
FROM maven:3.8.6-openjdk-17-slim AS build
WORKDIR /app

# Copier le pom parent
COPY ../../pom.xml ./pom.xml

# Copier le pom du service
COPY pom.xml ./eureka-server/pom.xml

# Copier les sources
COPY src ./eureka-server/src

# Build
WORKDIR /app/eureka-server
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copier le jar depuis le stage build
COPY --from=build /app/eureka-server/target/*.jar app.jar

# Exposer le port
EXPOSE 8761

# Variables d'environnement
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8761/actuator/health || exit 1

# Démarrer l'application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]