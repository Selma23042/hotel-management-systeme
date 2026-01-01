# Stage 1: Build
FROM maven:3.8.6-openjdk-17-slim AS build
WORKDIR /app

COPY ../../pom.xml ./pom.xml
COPY pom.xml ./room-service/pom.xml
COPY src ./room-service/src

WORKDIR /app/room-service
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/room-service/target/*.jar app.jar

EXPOSE 8081

ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENV SPRING_DATASOURCE_URL="jdbc:postgresql://room-db:5432/roomdb"
ENV EUREKA_CLIENT_SERVICEURL_DEFAULTZONE="http://eureka-server:8761/eureka/"

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]