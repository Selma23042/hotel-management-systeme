@echo off
echo Demarrage du systeme de gestion hoteliere...
echo.

echo Arret des conteneurs existants...
cd docker
docker-compose down

echo Nettoyage...
docker system prune -f

echo Construction et demarrage des services...
docker-compose up --build -d

echo Attente du demarrage des services...
timeout /t 60

echo.
echo Etat des services:
docker-compose ps

echo.
echo Systeme demarre avec succes!
echo.
echo URLs disponibles:
echo    - Eureka Dashboard: http://localhost:8761
echo    - API Gateway: http://localhost:8080
echo    - RabbitMQ Management: http://localhost:15672 (admin/admin)
echo    - Application Web: http://localhost:4200
echo.