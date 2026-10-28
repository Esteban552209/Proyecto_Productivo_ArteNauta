# --- ETAPA 1: Construcción de la aplicación ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Genera la carpeta de producción (dist si usas Vite, o build si usas Create React App)
RUN npm run build

# --- ETAPA 2: Servidor web para producción ---
FROM nginx:alpine
# Copiamos los archivos compilados al servidor Nginx
# (Nota: cambia 'dist' por 'build' si tu proyecto usa Create React App)
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 para la web
EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]