# Guide CI/CD - Hotel Management System

## Vue d'ensemble

Notre pipeline CI/CD automatise entièrement le processus de build, test et déploiement de l'application.

## Architecture du Pipeline

### Stages

1. **Build** : Compilation de tous les microservices et du frontend
2. **Test** : Exécution des tests unitaires et d'intégration
3. **Package** : Construction des images Docker
4. **Deploy** : Déploiement sur les environnements cibles

### Branches

- `main` : Production
- `develop` : Développement
- `feature/*` : Nouvelles fonctionnalités

## Configuration GitLab CI/CD

### Variables nécessaires

Dans GitLab → Settings → CI/CD → Variables, ajoutez :

- `CI_REGISTRY_USER` : Votre username Docker Hub
- `CI_REGISTRY_PASSWORD` : Votre token Docker Hub
- `CI_REGISTRY` : docker.io

### Runners

Assurez-vous que vous avez un GitLab Runner configuré avec :
- Docker executor
- Privilèges suffisants pour build Docker images

## Déclenchement du Pipeline

### Automatique

Le pipeline se déclenche automatiquement sur :
- Push sur `main` ou `develop`
- Merge Request vers `main`

### Manuel

Certains stages nécessitent une validation manuelle :
- Déploiement en production

## Docker Registry

Les images sont stockées sur Docker Hub :
````
dockerhub.com/your-username/hotel-management/
  ├── eureka-server:latest
  ├── api-gateway:latest
  ├── room-service:latest
  ├── customer-service:latest
  ├── booking-service:latest
  ├── billing-service:latest
  └── frontend:latest
