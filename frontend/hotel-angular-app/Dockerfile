# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Copier les fichiers depuis le bon chemin
COPY frontend/hotel-angular-app/package*.json ./
RUN npm ci
COPY frontend/hotel-angular-app/ .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/dist/hotel-angular-app /usr/share/nginx/html

# Copier la configuration nginx
COPY frontend/hotel-angular-app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]