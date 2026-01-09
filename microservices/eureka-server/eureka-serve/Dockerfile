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

# Copier le pom du service eureka-server
COPY microservices/eureka-server/pom.xml ./eureka-server/pom.xml

# Copier les sources du service eureka-server
COPY microservices/eureka-server/src ./eureka-server/src

# Build du service eureka-server
WORKDIR /app/eureka-server
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copier l'artefact JAR généré dans le stage de build
COPY --from=build /app/eureka-server/target/*.jar app.jar

EXPOSE 8761

ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Vérification de santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8761/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
