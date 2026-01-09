# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copier le pom parent et l'installer dans le repository Maven local
COPY hotel-parent/pom.xml ./parent-pom.xml
RUN mvn install:install-file \
    -Dfile=./parent-pom.xml \
    -DgroupId=com.hotel \
    -DartifactId=hotel-parent \
    -Dversion=0.0.1-SNAPSHOT \
    -Dpackaging=pom

# Copier le pom du service (attention au chemin: eureka-server/eureka-serve/)
COPY microservices/eureka-server/eureka-serve/pom.xml ./eureka-server/pom.xml

# Copier les sources
COPY microservices/eureka-server/eureka-serve/src ./eureka-server/src

# Build
WORKDIR /app/eureka-server
RUN mvn clean package -DskipTests
# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Installer curl pour le healthcheck
RUN apk add --no-cache curl

COPY --from=build /app/eureka-server/target/*.jar app.jar

EXPOSE 8761

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]