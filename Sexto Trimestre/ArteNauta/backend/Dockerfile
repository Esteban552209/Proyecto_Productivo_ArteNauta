# Usamos una imagen oficial ligera de Node.js
FROM node:20-alpine

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY . .

# Exponemos el puerto en el que corre el backend (ej. 4000 o 3000)
EXPOSE 5173

# Comando para iniciar la aplicación
CMD ["npm", "start"]