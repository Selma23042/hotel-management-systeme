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

# Copier le pom du service Booking Service
COPY microservices/booking-service/pom.xml ./booking-service/pom.xml
COPY microservices/booking-service/src ./booking-service/src

WORKDIR /app/booking-service
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/booking-service/target/*.jar app.jar

EXPOSE 8082

ENV JAVA_OPTS="-Xms256m -Xmx512m"

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
