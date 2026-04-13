# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY "Gestor de empleados/package.json" "Gestor de empleados/package-lock.json" ./
RUN npm ci

COPY "Gestor de empleados/" .

RUN npm run build

# Stage 2: serve con nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
