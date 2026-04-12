# ETAPA 1: Construcción (Build)
# Usamos una imagen ligera de Node para compilar
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar el caché de capas de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# ETAPA 2: Servidor de Producción
# Usamos Nginx para servir los archivos estáticos generados en la etapa anterior
FROM nginx:stable-alpine

# Copiamos los archivos compilados desde la etapa de 'build'
# Nota: Vite genera la salida en la carpeta /dist
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx corre en primer plano por defecto en esta imagen
CMD ["nginx", "-g", "daemon off;"]
