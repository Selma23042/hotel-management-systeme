# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY frontend/hotel-angular-app/package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY frontend/hotel-angular-app/ .

# Build de production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copier les fichiers buildés (sans SSR, pas de sous-dossier browser)
COPY --from=build /app/dist/hotel-angular-app /usr/share/nginx/html

# Copier la configuration nginx
COPY frontend/hotel-angular-app/nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]